import {
  Binary,
  BrickWall,
  Radar,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { CorporateServiceCard } from "@/components/public/corporate-service-card";

const services: ReadonlyArray<{
  description: string;
  icon: LucideIcon;
  title: string;
}> = [
  {
    title: "Monitoreo de seguridad 24/7",
    description:
      "Detección de amenazas y respuesta a incidentes con monitoreo continuo de tu infraestructura.",
    icon: Radar,
  },
  {
    title: "Firewall gestionado",
    description:
      "Firewall perimetral administrado: reglas, segmentación, filtrado y reportes de tráfico.",
    icon: BrickWall,
  },
  {
    title: "VPN corporativa",
    description:
      "Acceso remoto seguro a tu red y servidores para equipos y sucursales, cifrado extremo a extremo.",
    icon: ShieldCheck,
  },
  {
    title: "Soluciones a medida",
    description:
      "Desarrollo de software e integraciones adaptadas a los procesos de tu organización.",
    icon: Binary,
  },
];

export function CorporateSecuritySection() {
  return (
    <section
      aria-labelledby="corporate-security-title"
      className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-20"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-[#2456d6] uppercase sm:text-sm">
            Seguridad gestionada
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#0b2038] text-balance sm:text-4xl lg:text-5xl"
            id="corporate-security-title"
          >
            Protección, monitoreo y respuesta
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-5">
          {services.map((service) => (
            <CorporateServiceCard key={service.title} tone="slate" {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
