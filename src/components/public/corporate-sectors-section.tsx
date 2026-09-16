import {
  BriefcaseBusiness,
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  Store,
  Tractor,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const sectors: ReadonlyArray<{ icon: LucideIcon; name: string }> = [
  { name: "Industrias", icon: Factory },
  { name: "Comercios", icon: Store },
  { name: "Cooperativas y mutuales", icon: Landmark },
  { name: "Instituciones", icon: Building2 },
  { name: "Agro", icon: Tractor },
  { name: "Salud", icon: HeartPulse },
  { name: "Educación", icon: GraduationCap },
  { name: "Estudios y profesionales", icon: BriefcaseBusiness },
  { name: "Empresas de servicios", icon: Wrench },
];

export function CorporateSectorsSection() {
  return (
    <section
      aria-labelledby="corporate-sectors-title"
      className="relative isolate overflow-hidden bg-[#071a2f] py-20 text-white sm:py-24"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="public-grid-pattern absolute inset-0 opacity-35" />
        <div className="absolute -top-44 right-1/4 size-96 rounded-full bg-[#2f6bff]/10 blur-3xl" />
      </div>
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-[#7fa2ff] uppercase sm:text-sm">
            Experiencia regional
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-balance sm:text-4xl lg:text-5xl"
            id="corporate-sectors-title"
          >
            Soluciones para organizaciones de la región
          </h2>
        </div>

        <ul className="mt-10 grid list-none gap-3 sm:grid-cols-2 md:grid-cols-3 lg:mt-12 lg:grid-cols-5">
          {sectors.map(({ icon: Icon, name }) => (
            <li
              className="flex min-h-24 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition-colors hover:border-[#2f6bff]/45 hover:bg-white/[0.07] lg:flex-col lg:items-start lg:justify-center"
              key={name}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2f6bff]/15 text-[#8eabff]" aria-hidden="true">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span className="font-display text-sm leading-5 font-bold text-slate-100">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
