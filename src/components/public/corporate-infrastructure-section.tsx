import {
  Boxes,
  Cloud,
  DatabaseBackup,
  MailCheck,
  ServerCog,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

import { CorporateServiceCard } from "@/components/public/corporate-service-card";

const services: ReadonlyArray<{
  description: string;
  icon: LucideIcon;
  title: string;
}> = [
  {
    title: "ConectarCloud — Nube privada",
    description:
      "Archivos y colaboración en la nube, alojados en infraestructura propia en Argentina, con control total de tus datos.",
    icon: Cloud,
  },
  {
    title: "VPS y servidores virtuales",
    description:
      "Recursos de servidor virtual adaptables, con la potencia que tu operación necesita.",
    icon: Boxes,
  },
  {
    title: "Servidores administrados",
    description:
      "Linux, Windows Server y contenedores LXC: despliegue, actualización, monitoreo y soporte.",
    icon: ServerCog,
  },
  {
    title: "Storage y backup",
    description:
      "Almacenamiento y respaldo gestionado de servidores y VMs, con restauración probada.",
    icon: DatabaseBackup,
  },
  {
    title: "Housing",
    description:
      "Espacio e infraestructura para alojar tu equipamiento en nuestro data center.",
    icon: Warehouse,
  },
  {
    title: "Dominios, DNS y correo",
    description:
      "Administración de dominios, DNS primario/secundario, correo con dominio y mail para campañas.",
    icon: MailCheck,
  },
];

export function CorporateInfrastructureSection() {
  return (
    <section
      aria-labelledby="corporate-infrastructure-title"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-[#2456d6] uppercase sm:text-sm">
            Data center y servicios digitales
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#0b2038] text-balance sm:text-4xl lg:text-5xl"
            id="corporate-infrastructure-title"
          >
            Infraestructura física y virtual
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {services.map((service) => (
            <CorporateServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
