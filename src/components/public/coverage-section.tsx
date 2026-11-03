"use client";

import { CheckCircle2, CircleAlert, MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

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
  const addressRef = useRef<HTMLInputElement>(null);
  const closeResultRef = useRef<HTMLButtonElement>(null);
  const resultWasOpen = useRef(false);

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
  const showResult = Boolean(result && content);

  useEffect(() => {
    if (showResult) {
      resultWasOpen.current = true;
      closeResultRef.current?.focus();
    } else if (resultWasOpen.current) {
      resultWasOpen.current = false;
      addressRef.current?.focus();
    }
  }, [showResult, result]);

  function closeResult() {
    setResult(null);
    setError(null);
  }

  return (
    <article
      className="relative flex h-full min-w-0 flex-col rounded-3xl bg-brand-navy-deep p-5 text-white shadow-sm sm:p-7"
      aria-labelledby="coverage-title"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_85%_15%,rgba(242,138,46,.16),transparent_45%)]" aria-hidden="true" />
      <div className="relative flex h-full min-w-0 flex-col" inert={showResult}>
        <span className="grid size-12 place-items-center rounded-xl bg-white/10 text-home-yellow" aria-hidden="true">
          <MapPin className="size-8" strokeWidth={1.75} />
        </span>
        <h3 className="mt-4 text-2xl font-bold tracking-tight text-balance" id="coverage-title">Consultá nuestra cobertura</h3>
        <p className="mt-3 max-w-lg leading-7 text-slate-300">Descubrí si la fibra óptica de Conectar llega a tu domicilio</p>

        <form className="mt-6 flex flex-1 flex-col" noValidate onSubmit={handleSubmit}>
          <label className="text-sm font-bold text-white" htmlFor="coverage-address">Dirección</label>
          <div className="mt-2 flex flex-1 flex-col gap-3">
            <div className="relative min-w-0">
              <MapPin className="absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                aria-describedby={error ? "coverage-error" : "coverage-help"}
                aria-invalid={Boolean(error)}
                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-base text-slate-950 outline-none transition placeholder:text-base placeholder:text-slate-400 focus:border-home-accent focus:ring-2 focus:ring-home-accent/25"
                ref={addressRef}
                id="coverage-address"
                maxLength={COVERAGE_ADDRESS_MAX_LENGTH}
                minLength={COVERAGE_ADDRESS_MIN_LENGTH}
                name="address"
                placeholder="Ej. F. Dentesano 11, Sunchales"
                required
                type="text"
              />
            </div>
            {error && !result && <p className="text-sm font-semibold text-red-200" id="coverage-error" role="alert">{error}</p>}
            <button className="home-gradient mt-auto inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-center font-extrabold text-brand-navy-deep transition duration-150 motion-safe:enabled:hover:-translate-y-px hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-accent disabled:cursor-wait disabled:opacity-70" disabled={isLoading} type="submit">
              <Search className="size-4 shrink-0" aria-hidden="true" /> {isLoading ? "Consultando..." : "Consultar cobertura"}
            </button>
          </div>
          <p className="sr-only" id="coverage-help">Ingresá una dirección de entre {COVERAGE_ADDRESS_MIN_LENGTH} y {COVERAGE_ADDRESS_MAX_LENGTH} caracteres.</p>
        </form>

      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true" role="status">
        {showResult && content ? `${content.title} ${content.description}` : ""}
      </p>

      {result && content && (
        <div
          className="absolute inset-x-3 top-1/2 z-10 -translate-y-1/2 flex h-auto max-h-[calc(100%_-_1.5rem)] min-h-0 flex-col rounded-2xl border border-white/15 bg-[#102d49] p-4 shadow-2xl sm:inset-x-4 sm:max-h-[calc(100%_-_2rem)] sm:p-5"
          role="dialog"
          aria-labelledby="coverage-result-title"
          aria-describedby="coverage-result-description"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeResult();
            }
          }}
        >
          <div className="flex shrink-0 items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-200">Resultado de cobertura</p>
            <button
              ref={closeResultRef}
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/15 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-yellow"
              type="button"
              aria-label="Cerrar resultado de cobertura"
              onClick={closeResult}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div
            className="mt-3 min-h-0 overflow-y-auto overscroll-contain rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-yellow"
            role="region"
            aria-label="Detalles del resultado de cobertura"
            tabIndex={0}
          >
            <div className="flex items-start gap-3">
              <ResultIcon className="mt-0.5 size-5 shrink-0 text-home-yellow" aria-hidden="true" />
              <div className="min-w-0">
                <h4 className="font-bold text-white" id="coverage-result-title">{content.title}</h4>
                <p className="mt-1 text-sm leading-6 text-slate-300" id="coverage-result-description">{content.description}</p>
              </div>
            </div>
            {error && <p className="mt-3 text-sm font-semibold text-red-200" id="coverage-error" role="alert">{error}</p>}
          </div>

          <div className="mt-2 shrink-0 border-t border-white/10 pt-1.5">
            {whatsappUrl ? (
              <a aria-label="Consultar por WhatsApp" className="inline-flex min-h-12 w-full min-w-0 max-w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-center font-extrabold text-brand-navy-deep transition-colors hover:bg-whatsapp-strong hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp sm:px-5" href={whatsappUrl} rel="noopener noreferrer" target="_blank">
                <WhatsAppIcon className="size-6 shrink-0" />
                <span>Consultar por WhatsApp</span>
              </a>
            ) : (
              <p className="text-sm text-slate-300">La consulta por WhatsApp no está disponible en este momento.</p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
