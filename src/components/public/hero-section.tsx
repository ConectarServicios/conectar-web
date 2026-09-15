"use client";

import { ArrowRight, Building2, Clock3, Cloud, Headphones, Home, Network, Server, ShieldCheck, Wifi } from "lucide-react";

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
    secondary: { label: "Conocer Conectar Play", href: "#play" },
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
    { title: "Fibra óptica propia", detail: "Red FTTH hasta tu casa", icon: Wifi },
    { title: "Atención local", detail: "Equipo en Sunchales", icon: Home },
    { title: "Guardia fin de semana", detail: "Sáb, dom y feriados", icon: Headphones },
    { title: "Autogestión online", detail: "Tu cuenta, 24 h", icon: Clock3 },
  ],
  corporativo: [
    { title: "Un solo proveedor", detail: "Red + infra + seguridad", icon: Network },
    { title: "Datos en Argentina", detail: "Control total de tu información", icon: Server },
    { title: "Monitoreo 24/7", detail: "Con guardia de soporte", icon: ShieldCheck },
    { title: "Respuesta local", detail: "Cercana y directa", icon: Building2 },
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

        <div className="public-container grid min-h-[610px] items-center gap-14 py-20 lg:grid-cols-[1.12fr_.88fr] lg:py-24">
          <div className="max-w-[760px]">
            <p className={`mb-6 flex items-center gap-3 text-xs font-extrabold tracking-[0.14em] uppercase sm:text-sm ${isHome ? "text-[#61dfb7]" : "text-[#83a8ff]"}`}>
              <span className={`size-2 rounded-full ${isHome ? "bg-[#12b886] shadow-[0_0_18px_#12b886]" : "bg-[#2f6bff] shadow-[0_0_18px_#2f6bff]"}`} aria-hidden="true" />
              {current.eyebrow}
            </p>
            <h1 className="font-display text-[clamp(2.6rem,6vw,4.75rem)] leading-[1.05] font-bold tracking-[-0.045em] text-balance" id="public-hero-title">
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

          <div className="relative mx-auto hidden aspect-square w-full max-w-[430px] lg:block" aria-hidden="true">
            <div className={`absolute inset-[4%] rounded-full border ${isHome ? "border-[#12b886]/20" : "border-[#2f6bff]/25"}`} />
            <div className="absolute inset-[20%] rounded-full border border-white/10" />
            <div className={`absolute inset-[35%] grid place-items-center rounded-[2rem] border border-white/15 bg-white/[0.07] shadow-2xl backdrop-blur-sm ${isHome ? "text-[#61dfb7] shadow-emerald-950/50" : "text-[#83a8ff] shadow-blue-950/50"}`}>
              {isHome ? <Home className="size-16" strokeWidth={1.4} /> : <Cloud className="size-16" strokeWidth={1.4} />}
            </div>
            <span className={`absolute left-[5%] top-[48%] size-3 rounded-full ${isHome ? "bg-[#12b886]" : "bg-[#2f6bff]"}`} />
            <span className="absolute right-[11%] top-[22%] size-2.5 rounded-full bg-white/70" />
            <span className={`absolute bottom-[16%] right-[15%] size-5 rounded-full border-2 ${isHome ? "border-[#61dfb7]" : "border-[#83a8ff]"}`} />
          </div>
        </div>
      </section>

      <aside className="border-b border-slate-200 bg-white" aria-label="Razones para elegir Conectar Servicios">
        <ul className="public-container grid list-none grid-cols-1 divide-y divide-slate-200 py-2 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {trustItems[segment].map(({ title, detail, icon: Icon }) => (
            <li className="flex items-center gap-3 px-2 py-5 first:pl-0 sm:px-5 lg:py-6" key={title}>
              <span className={`grid size-10 shrink-0 place-items-center rounded-full ${isHome ? "bg-emerald-50 text-[#0b966d]" : "bg-blue-50 text-[#2f6bff]"}`}>
                <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
              </span>
              <span>
                <strong className="font-display block text-sm font-bold text-[#071a2f]">{title}</strong>
                <span className="mt-0.5 block text-xs text-slate-500">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
