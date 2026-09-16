import {
  Cable,
  Cloud,
  DatabaseBackup,
  Eye,
  LockKeyhole,
  Network,
  Phone,
  Server,
  ShieldCheck,
  Wifi,
  type LucideIcon,
} from "lucide-react";

const technologies: ReadonlyArray<{ icon: LucideIcon; name: string }> = [
  { name: "Fibra óptica", icon: Cable },
  { name: "Redes empresariales", icon: Network },
  { name: "Servidores y virtualización", icon: Server },
  { name: "Cloud privado", icon: Cloud },
  { name: "Storage y backup", icon: DatabaseBackup },
  { name: "Firewall y seguridad", icon: ShieldCheck },
  { name: "VPN", icon: LockKeyhole },
  { name: "Monitoreo", icon: Eye },
  { name: "WiFi empresarial", icon: Wifi },
  { name: "Telefonía IP", icon: Phone },
];

export function CorporateTechnologySection() {
  return (
    <section aria-labelledby="corporate-technology-title" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-[#2456d6] uppercase sm:text-sm">Tecnología</p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#0b2038] text-balance sm:text-4xl lg:text-5xl"
            id="corporate-technology-title"
          >
            Tecnología para una infraestructura confiable
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Integramos conectividad, infraestructura y seguridad utilizando tecnologías probadas y administradas por nuestro equipo.
          </p>
        </div>

        <ul className="mt-9 grid list-none grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-10 lg:grid-cols-5">
          {technologies.map(({ icon: Icon, name }) => (
            <li className="flex min-h-28 flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5" key={name}>
              <Icon aria-hidden="true" className="text-[#2456d6]" size={22} strokeWidth={2} />
              <span className="font-display mt-5 text-sm leading-5 font-bold text-[#0b2038]">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
