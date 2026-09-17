import type { ServiceGroupDefinition } from "@/data/services/types";

export const serviceGroups = [
  {
    slug: "internet-wifi",
    title: "Internet y WiFi",
    shortDescription:
      "Conectividad y cobertura Wi-Fi para disfrutar una experiencia estable en todo tu hogar.",
    segments: ["hogar"],
    icon: "wifi",
    order: 1,
    showOnServicesIndex: true,
    hasLandingPage: false,
  },
  {
    slug: "seguridad-hogar",
    title: "Seguridad para el hogar",
    shortDescription:
      "Alarmas y videovigilancia para cuidar tu casa con acompañamiento permanente.",
    segments: ["hogar"],
    icon: "bell-ring",
    order: 2,
    showOnServicesIndex: true,
    hasLandingPage: false,
  },
  {
    slug: "entretenimiento",
    title: "Entretenimiento",
    shortDescription:
      "Televisión y contenidos para disfrutar en tus dispositivos con Conectar Play.",
    segments: ["hogar"],
    icon: "tv",
    order: 3,
    showOnServicesIndex: true,
    hasLandingPage: false,
  },
  {
    slug: "conectividad",
    title: "Conectividad",
    shortDescription:
      "Internet, redes y comunicaciones confiables para empresas y organizaciones.",
    segments: ["corporativo"],
    icon: "network",
    order: 4,
    showOnServicesIndex: true,
    hasLandingPage: false,
  },
  {
    slug: "infraestructura",
    title: "Infraestructura",
    shortDescription:
      "Nube, servidores, almacenamiento y servicios digitales para sostener tu operación.",
    segments: ["corporativo"],
    icon: "server-cog",
    order: 5,
    showOnServicesIndex: true,
    hasLandingPage: false,
  },
  {
    slug: "seguridad-gestionada",
    title: "Seguridad gestionada",
    shortDescription:
      "Protección, monitoreo y soluciones tecnológicas administradas para tu organización.",
    segments: ["corporativo"],
    icon: "shield-check",
    order: 6,
    showOnServicesIndex: true,
    hasLandingPage: false,
  },
] as const satisfies readonly ServiceGroupDefinition[];

const groupSlugs = serviceGroups.map(({ slug }) => slug);

if (new Set(groupSlugs).size !== groupSlugs.length) {
  throw new Error("El catálogo de grupos de servicios contiene slugs duplicados.");
}
