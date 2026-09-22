import {
  BriefcaseBusiness,
  HeartPulse,
  Landmark,
  Store,
  Wheat,
  type LucideIcon,
} from "lucide-react";

import styles from "@/components/public/technology-marquee.module.css";
import { TechnologyLogo } from "@/components/public/technology-logo";

const sectors: ReadonlyArray<{ icon: LucideIcon; name: string }> = [
  { name: "Agroindustria y lácteo", icon: Wheat },
  { name: "Salud", icon: HeartPulse },
  { name: "Comercio y PyME", icon: Store },
  { name: "Cooperativas y mutuales", icon: Landmark },
  { name: "Estudios y profesionales", icon: BriefcaseBusiness },
];

const technologies = [
  { name: "Linux", logo: "linux" },
  { name: "Windows Server", logo: "windows" },
  { name: "Cisco", logo: "cisco" },
  { name: "VMware", logo: "vmware" },
  { name: "Wazuh", logo: "wazuh" },
  { name: "Hikvision", logo: "hikvision" },
] as const;

const technologyPillClassName =
  "group inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full border border-corporate-border bg-white px-4 py-2.5 text-brand-navy shadow-sm shadow-slate-950/[0.04] transition-[border-color,box-shadow] duration-200 hover:border-corporate-accent/40 hover:shadow-md sm:min-h-14 sm:px-5";

function TechnologyList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={`${styles.list} ${duplicate ? styles.duplicate : ""}`}
    >
      {technologies.map(({ logo, name }) => (
        <li className={technologyPillClassName} key={name}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-corporate-surface-soft text-corporate-accent-strong transition-colors group-hover:bg-[#dce6ff] sm:size-9">
            <TechnologyLogo name={logo} />
          </span>
          <span className="font-display whitespace-nowrap text-sm font-bold tracking-[-0.015em] sm:text-base">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function CorporateSectorsSection() {
  return (
    <section
      aria-labelledby="corporate-sectors-title"
      className="relative isolate overflow-hidden bg-corporate-surface py-16 sm:py-20 lg:py-24"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-48 right-0 size-96 rounded-full bg-corporate-accent/[0.07] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-slate-300/70 to-transparent" />
      </div>
      <div className="public-container">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,.7fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-corporate-accent-strong uppercase sm:text-sm">
              Experiencia regional
            </p>
            <h2
              className="font-display mt-4 max-w-3xl text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-brand-navy text-balance sm:text-4xl lg:text-5xl"
              id="corporate-sectors-title"
            >
              Soluciones para organizaciones de la región
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600 lg:pb-1">
            Acompañamos operaciones con necesidades diversas, integrando tecnología y soporte con una mirada cercana.
          </p>
        </div>

        <ul className="mt-8 flex list-none flex-wrap gap-3 sm:gap-4 lg:mt-10">
          {sectors.map(({ icon: Icon, name }) => (
            <li
              className="group inline-flex min-h-14 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-brand-navy shadow-sm shadow-slate-950/[0.03] transition duration-200 hover:-translate-y-0.5 hover:border-corporate-accent/30 hover:shadow-md sm:min-h-16 sm:px-5"
              key={name}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-corporate-surface-soft text-corporate-accent-strong transition-colors group-hover:bg-[#dce6ff]" aria-hidden="true">
                <Icon size={17} strokeWidth={2} />
              </span>
              <span className="font-display text-sm leading-5 font-bold sm:text-base">{name}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 border-t border-slate-300/80 pt-10 sm:mt-14 sm:pt-12">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-corporate-accent-strong uppercase sm:text-sm">
                Tecnología
              </p>
              <h3 className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-brand-navy text-balance sm:text-4xl">
                Tecnología con la que trabajamos
              </h3>
            </div>
            <p className="max-w-2xl text-base leading-7 text-slate-600 lg:justify-self-end">
              Integramos conectividad, infraestructura y seguridad utilizando tecnologías probadas y administradas por nuestro equipo.
            </p>
          </div>

          <div className="mt-8 border-y border-slate-300/80 py-5 sm:py-6 lg:mt-10">
            <div className={styles.viewport}>
              <div className={styles.track}>
                <TechnologyList />
                <TechnologyList duplicate />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
