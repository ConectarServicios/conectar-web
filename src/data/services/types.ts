export type ServiceSegment = "hogar" | "corporativo";

export type ServiceGroup =
  | "conectividad"
  | "infraestructura"
  | "seguridad-gestionada"
  | "seguridad-hogar"
  | "mas-que-internet";

export type ServiceIcon =
  | "arrow-left-right"
  | "binary"
  | "boxes"
  | "brick-wall"
  | "cable"
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
  | "warehouse"
  | "wifi";

export type ServiceDetail = {
  description?: string;
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
