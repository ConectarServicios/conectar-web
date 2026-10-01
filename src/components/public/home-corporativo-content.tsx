import { Check, Network, Server, ShieldCheck, type LucideIcon } from "lucide-react";

import { CorporateComparisonSection } from "@/components/public/corporate-comparison-section";
import { CorporateConnectivitySection } from "@/components/public/corporate-connectivity-section";
import { CorporateInfrastructureSection } from "@/components/public/corporate-infrastructure-section";
import { CorporateProcessSection } from "@/components/public/corporate-process-section";
import { CorporateSecuritySection } from "@/components/public/corporate-security-section";
import { CorporateSectorsSection } from "@/components/public/corporate-sectors-section";
import { CorporateTrustSection } from "@/components/public/corporate-trust-section";

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
    <>
      <section
        aria-labelledby="corporate-integrated-it-title"
        className="relative isolate scroll-mt-20 overflow-hidden border-b border-corporate-border bg-corporate-surface py-20 sm:py-24 lg:py-28"
        id="servicios"
      >
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-32 right-0 size-[30rem] rounded-full bg-corporate-accent/[0.07] blur-3xl" />
        </div>

        <div className="public-container grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,.82fr)] lg:gap-16 xl:gap-24">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-corporate-accent-strong uppercase sm:text-sm">
              Por qué Conectar
            </p>
            <h2
              className="font-display mt-4 max-w-3xl text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-brand-navy text-balance sm:text-4xl lg:text-5xl"
              id="corporate-integrated-it-title"
            >
              Toda tu IT integrada, sin sumar proveedores
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              La mayoría de las empresas arma su tecnología con un proveedor de internet, otro de servidores y otro de seguridad. Nosotros lo resolvemos en una sola relación, con una única puerta de entrada para todo.
            </p>

            <ul className="mt-8 flex list-none flex-wrap gap-2.5">
              {benefits.map((benefit) => (
                <li className="flex min-h-9 items-center gap-2 rounded-full border border-corporate-accent/15 bg-corporate-accent/[0.07] px-3 py-1.5 text-sm font-bold text-brand-navy" key={benefit}>
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-corporate-accent/10 text-corporate-accent-strong" aria-hidden="true">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-3xl border border-corporate-accent/25 bg-brand-navy-deep px-5 py-6 shadow-xl shadow-slate-950/10 sm:px-7 sm:py-7">
            <h3 className="text-center text-xs font-black tracking-[0.2em] text-corporate-accent-soft uppercase">
              Tu IT, en un solo equipo
            </h3>
            <ol className="mt-6 space-y-6 sm:mt-7 sm:space-y-7">
              {layers.map(({ title, description, icon: Icon }, index) => (
                <li className="grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4" key={title}>
                  <span className="row-span-2 flex size-11 items-center justify-center rounded-xl border border-corporate-accent-soft/25 bg-corporate-accent/15 text-corporate-accent-soft" aria-hidden="true">
                    <Icon size={21} strokeWidth={2} />
                  </span>
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-xs font-bold tracking-[0.12em] text-corporate-accent-soft">0{index + 1}</span>
                    <h4 className="font-display text-sm font-bold tracking-[0.08em] text-white uppercase sm:text-base">{title}</h4>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p>
                </li>
              ))}
            </ol>
            <div className="mt-7 flex items-center gap-2.5 text-sm font-semibold text-slate-100">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-corporate-accent/20 text-corporate-accent-soft" aria-hidden="true">
                <Check size={12} strokeWidth={3} />
              </span>
              Una sola gestión técnica
            </div>
          </div>
        </div>
      </section>
      <CorporateConnectivitySection />
      <CorporateInfrastructureSection />
      <CorporateSecuritySection />
      <CorporateComparisonSection />
      <CorporateProcessSection />
      <CorporateSectorsSection />
      <CorporateTrustSection />
    </>
  );
}
