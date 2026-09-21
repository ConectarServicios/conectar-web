export type ServiceSegment = "hogar" | "corporativo";

export type ServiceGroup =
  | "conectividad"
  | "internet-wifi"
  | "infraestructura"
  | "seguridad-gestionada"
  | "seguridad-hogar"
  | "entretenimiento";

export type ServiceIcon =
  | "arrow-left-right"
  | "binary"
  | "bell-ring"
  | "boxes"
  | "brick-wall"
  | "cable"
  | "cctv"
  | "cloud"
  | "database-backup"
  | "ethernet-port"
  | "gauge"
  | "git-branch"
  | "mail-check"
  | "network"
  | "phone"
  | "radar"
  | "radio-tower"
  | "server-cog"
  | "shield-check"
  | "tv"
  | "warehouse"
  | "wifi";

export type ServiceDetail = {
  description?: string;
};

export type ServiceGroupDefinition = {
  slug: ServiceGroup;
  title: string;
  shortDescription: string;
  segments: readonly ServiceSegment[];
  icon: ServiceIcon;
  order: number;
  href?: string;
  showOnServicesIndex: boolean;
  hasLandingPage: boolean;
};

export type ServiceDefinition = {
  slug: string;
  title: string;
  shortDescription: string;
  description?: string;
  segments: readonly ServiceSegment[];
  group: ServiceGroup;
  icon: ServiceIcon;
  order: number;
  showOnHomeHogar: boolean;
  showOnHomeCorporativo: boolean;
  cta?: {
    label: string;
  };
  href?: string;
  hasDetailPage: boolean;
  detail?: ServiceDetail;
};
