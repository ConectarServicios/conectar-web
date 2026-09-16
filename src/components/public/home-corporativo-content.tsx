import { Check, Network, Server, ShieldCheck, type LucideIcon } from "lucide-react";

const benefits = ["Una sola factura", "Un solo contacto técnico", "Escalás sin migrar"];

const layers: ReadonlyArray<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Conectividad",
    description: "Fibra, enlaces e interconexión de sucursales",
    icon: Network,
  },
  {
    title: "Infraestructura",
    description: "Nube ConectarCloud, servidores y storage",
    icon: Server,
  },
  {
    title: "Seguridad",
    description: "Firewall, VPN y monitoreo gestionado",
    icon: ShieldCheck,
  },
];

export function HomeCorporativoContent() {
  return (
    <section
      aria-labelledby="corporate-integrated-it-title"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#071a2f] py-20 text-white sm:py-24 lg:py-28"
      id="servicios"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-32 right-0 size-[30rem] rounded-full bg-[#2f6bff]/10 blur-3xl" />
        <div className="public-grid-pattern absolute inset-0 opacity-40" />
      </div>

      <div className="public-container grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,.82fr)] lg:gap-16 xl:gap-24">
        <div>
          <p className="text-xs font-black tracking-[0.2em] text-[#7fa2ff] uppercase sm:text-sm">
            Por qué Conectar
          </p>
          <h2
            className="font-display mt-4 max-w-3xl text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-balance sm:text-4xl lg:text-5xl"
            id="corporate-integrated-it-title"
          >
            Toda tu IT integrada, sin sumar proveedores
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#b8c9d9] sm:text-lg sm:leading-8">
            La mayoría de las empresas arma su tecnología con un proveedor de internet, otro de servidores y otro de seguridad. Nosotros lo resolvemos en una sola relación, con una única puerta de entrada para todo.
          </p>

          <ul className="mt-8 grid list-none gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {benefits.map((benefit) => (
              <li className="flex items-center gap-3 text-sm font-bold text-slate-100" key={benefit}>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#2f6bff]/20 text-[#8eabff]" aria-hidden="true">
                  <Check size={15} strokeWidth={3} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-7">
          <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
            Las tres capas, un mismo equipo
          </h3>
          <ol className="mt-6 space-y-3">
            {layers.map(({ title, description, icon: Icon }, index) => (
              <li className="group grid grid-cols-[auto_1fr] gap-x-4 rounded-2xl border border-white/10 bg-[#0d2740]/80 p-4 transition-colors hover:border-[#2f6bff]/45 sm:p-5" key={title}>
                <span className="row-span-2 flex size-11 items-center justify-center rounded-xl border border-[#2f6bff]/30 bg-[#2f6bff]/15 text-[#8eabff]" aria-hidden="true">
                  <Icon size={21} strokeWidth={2} />
                </span>
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="font-display font-bold text-white">{title}</h4>
                  <span className="font-mono text-xs font-bold text-[#6887d9]">0{index + 1}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-[#a9bfd2]">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
