import Image from "next/image";

import styles from "@/components/public/home-highlights.module.css";

const highlights = [
  {
    title: "Fibra óptica propia",
    detail: "Red FTTH hasta tu casa",
    icon: "/brand/home-highlights/fiber.svg",
  },
  {
    title: "Atención local",
    detail: "Equipo en Sunchales",
    icon: "/brand/home-highlights/local-support.svg",
  },
  {
    title: "Guardia fin de semana",
    detail: "Sáb, dom y feriados",
    icon: "/brand/home-highlights/weekend-support.svg",
  },
  {
    title: "Autogestión online",
    detail: "Tu cuenta, 24 h",
    icon: "/brand/home-highlights/self-service.svg",
  },
] as const;

function HighlightList({ duplicate = false }: Readonly<{ duplicate?: boolean }>) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={`${styles.list} ${duplicate ? styles.duplicate : ""}`}
    >
      {highlights.map(({ detail, icon, title }) => (
        <li
          className="flex min-h-20 w-[17rem] shrink-0 snap-start items-center gap-3.5 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 py-3.5 shadow-[0_12px_30px_-20px_rgba(0,0,0,.8)] backdrop-blur-sm sm:w-[18rem] sm:px-5"
          key={title}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-home-accent/25 bg-home-accent/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
            <Image aria-hidden="true" alt="" height={24} src={icon} width={24} />
          </span>
          <span className="min-w-0">
            <strong className="font-display block text-sm leading-5 font-bold text-white sm:text-[0.9375rem]">
              {title}
            </strong>
            <span className="mt-0.5 block text-xs leading-5 text-[#adc3d6]">
              {detail}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function HomeHighlights() {
  return (
    <aside
      className="relative overflow-hidden border-y border-white/[0.08] bg-[#0a2238] py-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.03)] sm:py-5"
      aria-label="Razones para elegir Conectar Servicios"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(242,138,46,.10),transparent_28%),radial-gradient(circle_at_85%_50%,rgba(31,112,184,.12),transparent_30%)]" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[80rem] pl-5 sm:pl-8">
        <div
          className={`${styles.viewport} rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-accent`}
          tabIndex={0}
        >
          <div className={styles.track}>
            <HighlightList />
            <HighlightList duplicate />
          </div>
        </div>
      </div>
    </aside>
  );
}
