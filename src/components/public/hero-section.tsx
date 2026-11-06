
import { Database, MapPin, MonitorCheck, Network } from "lucide-react";
import Image from "next/image";

import { HeroBenefits } from "@/components/public/hero-benefits";

import { HomeHighlights } from "@/components/public/home-highlights";
import { ImportantNewsBanner } from "@/components/public/important-news-banner";
import type { NewsItem } from "@/types/news";

export type PublicSegment = "hogar" | "corporativo";

const content = {
  hogar: {
    eyebrow: "Internet 100% fibra óptica · Sunchales",
    title: "Conectividad para tu hogar, con atención cercana.",
    description:
      "Fibra óptica rápida y estable, entretenimiento con Conectar Play y soluciones de seguridad para proteger tu casa. Todo con el respaldo de un equipo local, incluso los fines de semana.",
    primary: { label: "Ver planes", href: "#planes" },
    secondary: { label: "Conocer Conectar Play", href: "/conectar-play" },
  },

  corporativo: {
    eyebrow: "Conectividad · Infraestructura · Seguridad",
    title: "Un solo proveedor para toda tu infraestructura IT.",
    description:
      "Conectividad de fibra, nube privada, servidores y ciberseguridad bajo un mismo techo. Datos en Argentina y respuesta local, sin depender de mesas de ayuda lejanas.",
    primary: { label: "Solicitar asesoramiento", href: "#contacto" },
    secondary: { label: "Ver servicios corporativos", href: "#servicios" },
  },
} satisfies Record<
  PublicSegment,
  {
    eyebrow: string;
    title: string;
    description: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  }
>;

const corporateTrustItems = [
  { title: "Un solo proveedor", detail: "Red + infra + seguridad", icon: Network },
  { title: "Datos en Argentina", detail: "Control total de tu información", icon: Database },
  { title: "Monitoreo 24/7", detail: "Con guardia de soporte", icon: MonitorCheck },
  { title: "Respuesta local", detail: "Cercana y directa", icon: MapPin },
];

export function HeroSection({
  alert,
  segment,
}: Readonly<{ alert?: NewsItem | null; segment: PublicSegment }>) {
  const current = content[segment];
  const isHome = segment === "hogar";
  const hasHomeAlert = isHome && Boolean(alert);

  return (
    <>
      <section
        className="relative isolate scroll-mt-20 overflow-hidden bg-brand-navy-deep text-white"
        id="inicio"
        aria-labelledby="public-hero-title"
      >
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div
            className={`absolute inset-0 ${
              isHome
                ? "bg-[radial-gradient(circle_at_78%_38%,rgba(242,138,46,.22),transparent_32%)]"
                : "bg-[radial-gradient(circle_at_78%_38%,rgba(47,107,255,.3),transparent_34%)]"
            }`}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_85%,rgba(31,112,184,.14),transparent_30%)]" />

          <div className={`public-grid-pattern absolute inset-0 ${isHome ? "opacity-55" : "opacity-70"}`} />
        </div>

        <div
          className={`public-container ${
            hasHomeAlert
              ? "pt-8 pb-10 sm:pt-10"
              : "py-10"
          } sm:pb-12 lg:py-14`}
        >
          {alert ? <ImportantNewsBanner item={alert} /> : null}

          <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
            <div className="min-w-0">
              <p
                className={`mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border px-4 py-2 text-xs leading-5 font-bold sm:text-sm ${
                  isHome
                    ? "border-home-accent/30 bg-brand-navy-deep/70 text-[#F6AD70]"
                    : "border-corporate-accent/40 bg-corporate-accent/12 text-[#9bb7ff]"
                }`}
              >
                <span
                  className={`size-2 shrink-0 rounded-full ${
                    isHome
                      ? "home-gradient shadow-[0_0_14px_#f28a2e]"
                      : "bg-corporate-accent shadow-[0_0_14px_#2f6bff]"
                  }`}
                  aria-hidden="true"
                />

                {current.eyebrow}
              </p>

              <h1
                className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.08] font-bold tracking-[-0.04em] text-balance"
                id="public-hero-title"
              >
                {current.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                {current.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-8 text-base font-black transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                    isHome
                      ? "home-gradient text-brand-navy shadow-[0_14px_30px_-16px_rgba(242,138,46,.9)] duration-150 hover:brightness-105 motion-safe:hover:-translate-y-px motion-reduce:transition-none"
                      : "bg-corporate-accent text-white shadow-[0_14px_30px_-16px_rgba(47,107,255,.65)] hover:bg-[#477dff] hover:-translate-y-0.5 motion-reduce:transform-none"
                  }`}
                  href={current.primary.href}
                >
                  {current.primary.label}
                </a>

                <a
                  className={`inline-flex items-center justify-center border transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:self-center ${
                    isHome
                      ? "min-h-14 rounded-xl border-[#6E95BC]/60 bg-[linear-gradient(135deg,#315C88_0%,#183A62_100%)] px-8 text-base font-bold text-white duration-150 hover:border-[#6E95BC] hover:brightness-105 motion-safe:hover:-translate-y-px motion-reduce:transition-none"
                      : "min-h-12 rounded-lg border-white/15 bg-transparent px-6 font-semibold text-slate-200 hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
                  }`}
                  href={current.secondary.href}
                >
                  {current.secondary.label}
                </a>
              </div>
            </div>

            <div
              className="relative h-44 min-w-0 overflow-hidden rounded-2xl sm:h-60 lg:h-full lg:min-h-[420px] lg:rounded-3xl"
              aria-hidden="true"
            >
              <Image
                src={
                  isHome
                    ? "/images/heroes/hogar.png"
                    : "/images/heroes/corporativo.png"
                }
                alt=""
                fill
                sizes="(min-width: 1280px) 540px, (min-width: 1024px) 44vw, 100vw"
                className="object-cover"
                loading="eager"
              />

              <div className="absolute inset-0 bg-[linear-gradient(90deg,#071a2f_0%,rgba(7,26,47,.45)_22%,transparent_55%),linear-gradient(0deg,rgba(7,26,47,.65),transparent_45%)]" />
            </div>
          </div>
        </div>
      </section>

      {isHome ? (
        <HomeHighlights />
      ) : (
        <HeroBenefits items={corporateTrustItems} />
      )}
    </>
  );
}
