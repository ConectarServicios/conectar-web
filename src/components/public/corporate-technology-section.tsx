import {
  Boxes,
  Cctv,
  Network,
  Server,
  ShieldCheck,
  Terminal,
  type LucideIcon,
} from "lucide-react";

const technologies: ReadonlyArray<{ icon: LucideIcon; name: string }> = [
  { name: "Linux", icon: Terminal },
  { name: "Windows Server", icon: Server },
  { name: "Cisco", icon: Network },
  { name: "VMware", icon: Boxes },
  { name: "Wazuh", icon: ShieldCheck },
  { name: "Hikvision", icon: Cctv },
];

export function CorporateTechnologySection() {
  return (
    <section aria-labelledby="corporate-technology-title" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="public-container">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#2456d6] uppercase sm:text-sm">Tecnología</p>
            <h2
              className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#0b2038] text-balance sm:text-4xl"
              id="corporate-technology-title"
            >
              Tecnología para una infraestructura confiable
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-slate-600 lg:justify-self-end">
            Integramos conectividad, infraestructura y seguridad utilizando tecnologías probadas y administradas por nuestro equipo.
          </p>
        </div>

        <div className="mt-10 border-y border-slate-200 py-6 sm:py-7 lg:mt-12">
          <ul className="flex list-none flex-wrap gap-x-8 gap-y-5 sm:gap-x-10 lg:justify-between">
            {technologies.map(({ icon: Icon, name }, index) => (
              <li className="group inline-flex items-center gap-3" key={name}>
                <span className="flex size-9 items-center justify-center text-[#2456d6]" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <span className="font-display text-base font-bold tracking-[-0.015em] text-[#0b2038]">{name}</span>
                {index < technologies.length - 1 ? (
                  <span className="ml-5 hidden size-1 rounded-full bg-slate-300 lg:block" aria-hidden="true" />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
