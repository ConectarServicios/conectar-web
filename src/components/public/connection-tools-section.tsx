import { ArrowDown, ArrowUp, ExternalLink, Gauge, Timer } from "lucide-react";

import { CoverageSection } from "@/components/public/coverage-section";

// Reemplazar por el Speedtest propio de Conectar cuando esté disponible.
const SPEEDTEST_URL = "https://www.speedtest.net/es";

export function ConnectionToolsSection({ whatsapp }: Readonly<{ whatsapp: string | null }>) {
  return (
    <section className="scroll-mt-24 bg-white py-14 sm:py-18" aria-labelledby="connection-tools-title" id="cobertura">
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="public-eyebrow">Herramientas para tu conexión</p>
          <h2 className="public-heading mt-3" id="connection-tools-title">Todo lo que necesitás para estar conectado</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">Consultá la disponibilidad de fibra óptica en tu domicilio y comprobá la velocidad de tu conexión.</p>
        </div>

        <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-2">
          <CoverageSection whatsapp={whatsapp} />

          <article className="flex h-full min-w-0 flex-col rounded-3xl border border-home-border bg-home-surface-soft p-5 shadow-sm sm:p-7" aria-labelledby="speedtest-title">
            <span className="grid size-12 place-items-center rounded-xl bg-home-accent/10 text-home-accent-strong" aria-hidden="true">
              <Gauge className="size-6" />
            </span>
            <h3 className="mt-4 text-2xl font-bold tracking-tight text-brand-navy-deep text-balance" id="speedtest-title">Medí tu velocidad</h3>
            <p className="mt-3 max-w-lg leading-7 text-slate-600">Comprobá el rendimiento de tu Internet con el Speedtest recomendado por Conectar</p>

            <ul className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-home-border bg-white p-3 sm:gap-3 sm:p-4" aria-label="Qué podés medir con Speedtest">
              <li className="flex min-w-0 flex-col items-center gap-2 text-center text-xs font-bold text-brand-navy sm:text-sm">
                <ArrowDown className="size-5 text-home-accent-strong" aria-hidden="true" />
                Descarga
              </li>
              <li className="flex min-w-0 flex-col items-center gap-2 text-center text-xs font-bold text-brand-navy sm:text-sm">
                <ArrowUp className="size-5 text-home-accent-strong" aria-hidden="true" />
                Subida
              </li>
              <li className="flex min-w-0 flex-col items-center gap-2 text-center text-xs font-bold text-brand-navy sm:text-sm">
                <Timer className="size-5 text-home-accent-strong" aria-hidden="true" />
                Latencia
              </li>
            </ul>

            <div className="mt-auto pt-6">
              <a className="public-button-primary w-full text-center" href={SPEEDTEST_URL} target="_blank" rel="noopener noreferrer">
                Realizar Speedtest
                <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                <span className="sr-only">(abre en una pestaña nueva)</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
