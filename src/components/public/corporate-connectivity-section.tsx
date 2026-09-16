import {
  ArrowLeftRight,
  Cable,
  EthernetPort,
  Gauge,
  GitBranch,
  Network,
  Phone,
  RadioTower,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { CorporateServiceCard } from "@/components/public/corporate-service-card";

const services: ReadonlyArray<{
  description: string;
  icon: LucideIcon;
  title: string;
}> = [
  {
    title: "Internet corporativo",
    description: "Conectividad empresarial con soporte local y soluciones adaptadas a cada operación.",
    icon: RadioTower,
  },
  {
    title: "Internet simétrico",
    description: "Misma velocidad de subida y bajada para aplicaciones críticas, servidores, videollamadas y nube.",
    icon: ArrowLeftRight,
  },
  {
    title: "Telefonía IP",
    description: "Soluciones de telefonía sobre IP para centralizar y modernizar las comunicaciones de tu empresa.",
    icon: Phone,
  },
  {
    title: "Interconexión de sucursales",
    description: "Conectamos oficinas, plantas y sucursales para que trabajen sobre una misma infraestructura.",
    icon: Network,
  },
  {
    title: "Enlaces punto a punto",
    description: "Enlaces dedicados para conectar ubicaciones con comunicación directa y estable.",
    icon: GitBranch,
  },
  {
    title: "Redes y cableado estructurado",
    description: "Diseño, instalación y organización de redes de datos para oficinas, industrias y comercios.",
    icon: Cable,
  },
  {
    title: "WiFi empresarial",
    description: "Cobertura inalámbrica profesional, segmentación y administración para empleados, clientes y dispositivos.",
    icon: Wifi,
  },
  {
    title: "Redes ópticas / FTTH",
    description: "Diseño e implementación de redes de fibra óptica adaptadas a proyectos corporativos y urbanizaciones.",
    icon: EthernetPort,
  },
  {
    title: "Medición y certificación",
    description: "Medición, diagnóstico y certificación de cableado y enlaces para garantizar el rendimiento de la red.",
    icon: Gauge,
  },
];

export function CorporateConnectivitySection() {
  return (
    <section
      aria-labelledby="corporate-connectivity-title"
      className="bg-slate-50 py-16 sm:py-20 lg:py-20"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-[#2456d6] uppercase sm:text-sm">
            Conectividad para empresas
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#0b2038] text-balance sm:text-4xl lg:text-5xl"
            id="corporate-connectivity-title"
          >
            Red, fibra e interconexión
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-5">
          {services.map((service) => (
            <CorporateServiceCard ctaLabel="Consultar" key={service.title} tone="slate" {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
