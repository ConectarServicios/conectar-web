import {
  BriefcaseBusiness,
  HeartPulse,
  Landmark,
  Store,
  Wheat,
  type LucideIcon,
} from "lucide-react";

const sectors: ReadonlyArray<{ icon: LucideIcon; name: string }> = [
  { name: "Agroindustria y lácteo", icon: Wheat },
  { name: "Salud", icon: HeartPulse },
  { name: "Comercio y PyME", icon: Store },
  { name: "Cooperativas y mutuales", icon: Landmark },
  { name: "Estudios y profesionales", icon: BriefcaseBusiness },
];

export function CorporateSectorsSection() {
  return (
    <section
      aria-labelledby="corporate-sectors-title"
      className="relative isolate overflow-hidden bg-[#f5f8fc] py-20 sm:py-24 lg:py-28"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-48 right-0 size-96 rounded-full bg-[#2f6bff]/[0.07] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-slate-300/70 to-transparent" />
      </div>
      <div className="public-container">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,.7fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#2456d6] uppercase sm:text-sm">
              Experiencia regional
            </p>
            <h2
              className="font-display mt-4 max-w-3xl text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#0b2038] text-balance sm:text-4xl lg:text-5xl"
              id="corporate-sectors-title"
            >
              Soluciones para organizaciones de la región
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600 lg:pb-1">
            Acompañamos operaciones con necesidades diversas, integrando tecnología y soporte con una mirada cercana.
          </p>
        </div>

        <ul className="mt-10 flex list-none flex-wrap gap-3 sm:gap-4 lg:mt-14">
          {sectors.map(({ icon: Icon, name }) => (
            <li
              className="group inline-flex min-h-14 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-[#0b2038] shadow-sm shadow-slate-950/[0.03] transition duration-200 hover:-translate-y-0.5 hover:border-[#2f6bff]/30 hover:shadow-md sm:min-h-16 sm:px-5"
              key={name}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e9efff] text-[#2456d6] transition-colors group-hover:bg-[#dce6ff]" aria-hidden="true">
                <Icon size={17} strokeWidth={2} />
              </span>
              <span className="font-display text-sm leading-5 font-bold sm:text-base">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
