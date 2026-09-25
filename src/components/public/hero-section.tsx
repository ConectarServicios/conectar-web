import { HomeHighlights } from "@/components/public/home-highlights";

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
  { title: "Un solo proveedor", detail: "Red + infra + seguridad" },
  { title: "Datos en Argentina", detail: "Control total de tu información" },
  { title: "Monitoreo 24/7", detail: "Con guardia de soporte" },
  { title: "Respuesta local", detail: "Cercana y directa" },
];

export function HeroSection({
  segment,
}: Readonly<{ segment: PublicSegment }>) {
  const current = content[segment];
  const isHome = segment === "hogar";

  return (
    <>
      <section
        className="relative isolate scroll-mt-20 overflow-hidden bg-brand-navy-deep text-white"
        id="inicio"
        aria-labelledby="public-hero-title"
      >
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              isHome
                ? "bg-[radial-gradient(circle_at_78%_38%,rgba(242,138,46,.22),transparent_32%)]"
                : "bg-[radial-gradient(circle_at_78%_38%,rgba(47,107,255,.3),transparent_34%)]"
            }`}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_85%,rgba(31,112,184,.14),transparent_30%)]" />

          <div className="public-grid-pattern absolute inset-0 opacity-70" />
        </div>

        <div className="public-container flex items-start py-10 sm:min-h-[520px] sm:items-center sm:py-20 lg:min-h-[560px] lg:py-24">
          <div className="max-w-[820px]">
            <p
              className={`mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border px-4 py-2 text-xs leading-5 font-bold sm:text-sm ${
                isHome
                  ? "border-home-accent/40 bg-home-accent/10 text-home-yellow"
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
              className="font-display text-[clamp(2.5rem,5vw,3.7rem)] leading-[1.08] font-bold tracking-[-0.04em] text-balance"
              id="public-hero-title"
            >
              {current.title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {current.description}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-8 text-base font-black transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none ${
                  isHome
                    ? "home-gradient text-brand-navy shadow-[0_14px_30px_-16px_rgba(242,138,46,.9)] hover:brightness-105"
                    : "bg-corporate-accent text-white shadow-[0_14px_30px_-16px_rgba(47,107,255,.65)] hover:bg-[#477dff]"
                }`}
                href={current.primary.href}
              >
                {current.primary.label}
              </a>

              <a
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 bg-transparent px-6 font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:self-center"
                href={current.secondary.href}
              >
                {current.secondary.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {isHome ? (
        <HomeHighlights />
      ) : (
        <aside
          className="border-b border-corporate-accent/35 bg-[#102d49] py-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] sm:py-5"
          aria-label="Razones para elegir Conectar Servicios"
        >
          <ul className="public-container grid list-none grid-cols-1 gap-3 min-[440px]:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {corporateTrustItems.map(({ title, detail }) => (
              <li
                className="rounded-xl border border-white/10 bg-white/[0.055] px-4 py-4 shadow-sm shadow-slate-950/10 sm:px-5 sm:py-5"
                key={title}
              >
                <strong className="font-display block text-sm font-bold text-white sm:text-[0.9375rem]">
                  {title}
                </strong>

                <span className="mt-1.5 block text-xs leading-5 text-[#b8cbdb]">
                  {detail}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </>
  );
}
