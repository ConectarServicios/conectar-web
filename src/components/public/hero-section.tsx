"use client";

import { ArrowRight } from "lucide-react";

import { usePublicSegment, type PublicSegment } from "@/components/public/public-segment-context";

export type PublicHeroSlide = {
  id: string; title: string; subtitle: string | null; buttonText: string | null;
  buttonUrl: string | null; imageUrl: string; featured: boolean; external: boolean;
};

const content = {
  hogar: {
    eyebrow: "Internet 100% fibra óptica · Sunchales",
    title: "Conectividad para tu hogar, con atención de acá.",
    description: "Fibra óptica estable y rápida, televisión con Conectar Play y alarmas y cámaras para cuidar tu casa — todo con un equipo local que te atiende también los fines de semana.",
    primary: { label: "Ver planes", href: "#planes" },
    secondary: { label: "Conocer Conectar Play", href: "#conectar-play" },
  },
  corporativo: {
    eyebrow: "Conectividad · Infraestructura · Seguridad",
    title: "Un solo proveedor para toda tu infraestructura IT.",
    description: "Conectividad de fibra, nube privada, servidores y ciberseguridad bajo un mismo techo. Datos en Argentina y respuesta local, sin depender de mesas de ayuda lejanas.",
    primary: { label: "Solicitar asesoramiento", href: "#contacto" },
    secondary: { label: "Ver servicios corporativos", href: "#servicios" },
  },
} satisfies Record<PublicSegment, {
  eyebrow: string;
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}>;

const trustItems = {
  hogar: [
    { title: "Fibra óptica propia", detail: "Red FTTH hasta tu casa" },
    { title: "Atención local", detail: "Equipo en Sunchales" },
    { title: "Guardia fin de semana", detail: "Sáb, dom y feriados" },
    { title: "Autogestión online", detail: "Tu cuenta, 24 h" },
  ],
  corporativo: [
    { title: "Un solo proveedor", detail: "Red + infra + seguridad" },
    { title: "Datos en Argentina", detail: "Control total de tu información" },
    { title: "Monitoreo 24/7", detail: "Con guardia de soporte" },
    { title: "Respuesta local", detail: "Cercana y directa" },
  ],
};

export function HeroSection({ slides }: Readonly<{ slides?: PublicHeroSlide[] }>) {
  void slides;
  const { segment } = usePublicSegment();
  const current = content[segment];
  const isHome = segment === "hogar";

  return (
    <>
      <section
        className="relative isolate scroll-mt-20 overflow-hidden bg-[#071a2f] text-white"
        id="inicio"
        aria-labelledby="public-hero-title"
      >
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className={`absolute inset-0 transition-opacity duration-500 ${isHome ? "bg-[radial-gradient(circle_at_78%_38%,rgba(18,184,134,.24),transparent_32%)]" : "bg-[radial-gradient(circle_at_78%_38%,rgba(47,107,255,.3),transparent_34%)]"}`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_85%,rgba(31,112,184,.14),transparent_30%)]" />
          <div className="public-grid-pattern absolute inset-0 opacity-70" />
        </div>

        <div className="public-container flex min-h-[520px] items-center py-16 sm:py-20 lg:min-h-[560px] lg:py-24">
          <div className="max-w-[820px]">
            <p className={`mb-6 inline-flex max-w-full items-center gap-2.5 whitespace-nowrap rounded-full border px-4 py-2 text-[0.6875rem] leading-4 font-bold tracking-[0.035em] shadow-sm backdrop-blur-sm sm:text-xs ${isHome ? "border-[#12b886]/30 bg-[#12b886]/10 text-[#8ce8ca]" : "border-[#2f6bff]/35 bg-[#2f6bff]/10 text-[#a9c0ff]"}`}>
              <span className={`size-1.5 shrink-0 rounded-full ${isHome ? "bg-[#12b886] shadow-[0_0_12px_#12b886]" : "bg-[#2f6bff] shadow-[0_0_12px_#2f6bff]"}`} aria-hidden="true" />
              {current.eyebrow}
            </p>
            <h1 className="font-display text-[clamp(2.5rem,5vw,3.7rem)] leading-[1.08] font-bold tracking-[-0.04em] text-balance" id="public-hero-title">
              {current.title}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {current.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 font-extrabold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none ${isHome ? "bg-[#12b886] text-[#03221b] hover:bg-[#18c996]" : "bg-[#2f6bff] text-white hover:bg-[#477dff]"}`} href={current.primary.href}>
                {current.primary.label}<ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <a className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 bg-white/[0.04] px-6 font-bold text-white transition hover:border-white/35 hover:bg-white/[0.09] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href={current.secondary.href}>
                {current.secondary.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <aside className="bg-[#0d2740] text-white" aria-label="Razones para elegir Conectar Servicios">
        <ul className="public-container grid list-none grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {trustItems[segment].map(({ title, detail }) => (
            <li className="px-1 py-5 sm:px-5 lg:py-6 lg:first:pl-0 lg:last:pr-0" key={title}>
              <strong className="font-display block text-sm font-bold text-white">{title}</strong>
              <span className="mt-1 block text-xs text-[#a9bfd2]">{detail}</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
