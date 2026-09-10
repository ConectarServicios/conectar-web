export type ServiceArea = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  icon: string | null;
  public_url: string | null;
  featured: boolean;
  active: boolean;
  display_order: number;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  category: string | null;
  service_area_id: string | null;
  featured: boolean;
  active: boolean;
  display_order: number;
  service_areas?: Pick<ServiceArea, "id" | "name"> | Pick<ServiceArea, "id" | "name">[] | null;
};

export const SERVICE_OPTION_MODES = ["rental", "purchase"] as const;
export type ServiceOptionMode = (typeof SERVICE_OPTION_MODES)[number];
export type ServiceOption = { id: string; service_id: string; title: string; mode: ServiceOptionMode; equipment_count: number | null; price: number; price_label: string | null; description: string | null; active: boolean; display_order: number };
export const SERVICE_MEDIA_TYPES = ["hero", "equipment", "coverage", "gallery"] as const;
export type ServiceMediaType = (typeof SERVICE_MEDIA_TYPES)[number];
export type ServiceMedia = { id: string; service_id: string; type: ServiceMediaType; image_path: string; alt_text: string | null; caption: string | null; active: boolean; display_order: number };
export type PublicService = Omit<Service, "service_areas"> & { service_areas: Pick<ServiceArea, "id" | "name" | "slug"> | Pick<ServiceArea, "id" | "name" | "slug">[] | null; service_options?: ServiceOption[]; service_media?: ServiceMedia[] };

export type ServiceFormValues = Omit<Service, "id" | "service_areas" | "category">;
export type ServiceAreaFormValues = Omit<ServiceArea, "id">;

export type ServiceActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};
