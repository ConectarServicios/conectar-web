"use client";

import { CheckCircle2, CircleAlert, MapPin, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { WhatsAppIcon } from "@/components/public/whatsapp-icon";
import { buildCoverageWhatsAppUrl } from "@/lib/coverage/service";
import { COVERAGE_ADDRESS_MAX_LENGTH, COVERAGE_ADDRESS_MIN_LENGTH, validateCoverageAddress } from "@/lib/coverage/validation";
import type { CoverageResult, CoverageStatus } from "@/types/coverage";

const statusContent: Record<CoverageStatus, { title: string; description: string }> = {
  available: {
    title: "Tenemos cobertura en tu zona.",
    description: "Contactanos para conocer los planes disponibles para tu domicilio.",
  },
  unavailable: {
    title: "Por el momento no contamos con cobertura en ese domicilio.",
    description: "Podés consultarnos para conocer otras alternativas disponibles.",
  },
  review: {
    title: "Necesitamos verificar tu domicilio.",
    description: "Nuestro equipo puede revisar manualmente la disponibilidad en tu dirección.",
  },
  "not-configured": {
    title: "Estamos preparando la consulta automática de cobertura.",
    description: "Por ahora podemos verificar tu domicilio de forma manual.",
  },
};

const upcomingContent = {
  title: "Próximamente tendremos cobertura en tu zona.",
  description: "Podés consultarnos para conocer el estado de expansión.",
};

export function CoverageSection({ whatsapp }: Readonly<{ whatsapp: string | null }>) {
  const [result, setResult] = useState<CoverageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawAddress = String(formData.get("address") ?? "");
    const validation = validateCoverageAddress(rawAddress);

    if (!validation.valid) {
      setResult(null);
      setError(validation.message);
      return;
    }

    if (isLoading) return;
    setError(null);
    setResult(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/coverage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: validation.address }),
      });
      const payload: unknown = await response.json();
      if (!response.ok || !payload || typeof payload !== "object" ||
          !("status" in payload) || !("address" in payload)) throw new Error("Invalid response");
      setResult(payload as CoverageResult);
    } catch {
      setError("No pudimos verificar la cobertura en este momento. Podés consultarnos por WhatsApp.");
      setResult({ address: validation.address, status: "review", reason: "geocoding-error" });
    } finally {
      setIsLoading(false);
    }
  }

  const content = result
    ? result.reason === "upcoming" ? upcomingContent : statusContent[result.status]
    : null;
  const whatsappUrl = result ? buildCoverageWhatsAppUrl(whatsapp, result.address) : null;
  const ResultIcon = result?.status === "available" ? CheckCircle2 : CircleAlert;

  return (
    <section className="bg-white py-14 sm:py-18" aria-labelledby="coverage-title" id="cobertura">
      <div className="public-container">
        <div className="relative overflow-hidden rounded-3xl bg-brand-navy-deep px-5 py-8 text-white shadow-xl sm:px-10 sm:py-10 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(440px,0.8fr)] lg:items-center lg:gap-10 lg:px-12 lg:py-9">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(242,138,46,.2),transparent_35%)]" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-black tracking-[0.2em] text-home-yellow uppercase">Cobertura</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-balance sm:text-4xl" id="coverage-title">¿Conectar llega a tu domicilio?</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">Ingresá tu dirección y verificá la disponibilidad del servicio en tu zona.</p>
          </div>

          <div className="relative mt-7 lg:mt-0">
            <form className="rounded-2xl bg-white p-4 shadow-lg sm:p-5" noValidate onSubmit={handleSubmit}>
              <label className="text-sm font-bold text-brand-navy-deep" htmlFor="coverage-address">Dirección</label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <MapPin className="absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    aria-describedby={error ? "coverage-error" : "coverage-help"}
                    aria-invalid={Boolean(error)}
                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-home-accent focus:ring-2 focus:ring-home-accent/25"
                    id="coverage-address"
                    maxLength={COVERAGE_ADDRESS_MAX_LENGTH}
                    minLength={COVERAGE_ADDRESS_MIN_LENGTH}
                    name="address"
                    placeholder="Ej. Av. Independencia 1234, Sunchales"
                    required
                    type="text"
                  />
                </div>
                <button className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-home-accent px-5 font-extrabold text-brand-navy-deep transition hover:bg-home-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-accent disabled:cursor-wait disabled:opacity-70" disabled={isLoading} type="submit">
                  <Search className="size-4" aria-hidden="true" /> {isLoading ? "Consultando..." : "Consultar cobertura"}
                </button>
              </div>
              <p className="sr-only" id="coverage-help">Ingresá una dirección de entre {COVERAGE_ADDRESS_MIN_LENGTH} y {COVERAGE_ADDRESS_MAX_LENGTH} caracteres.</p>
              {error && <p className="mt-3 text-sm font-semibold text-red-700" id="coverage-error" role="alert">{error}</p>}
            </form>

            {result && content && (
              <div className="mt-3 rounded-2xl border border-white/15 bg-white/[0.08] p-5" aria-live="polite" role="status">
                <div className="flex items-start gap-3">
                  <ResultIcon className="mt-0.5 size-5 shrink-0 text-home-yellow" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-white">{content.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{content.description}</p>
                  </div>
                </div>
                {whatsappUrl ? (
                  <a aria-label="Consultar por WhatsApp" className="mt-4 inline-flex min-h-12 w-full min-w-0 max-w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-center font-extrabold text-brand-navy-deep transition-colors hover:bg-whatsapp-strong hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp sm:w-auto sm:px-5" href={whatsappUrl} rel="noopener noreferrer" target="_blank">
                    <WhatsAppIcon className="size-6 shrink-0" />
                    <span>Consultar por WhatsApp</span>
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-slate-300">La consulta por WhatsApp no está disponible en este momento.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
