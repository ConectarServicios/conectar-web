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

export type ServiceFormValues = Omit<Service, "id" | "service_areas" | "category">;
export type ServiceAreaFormValues = Omit<ServiceArea, "id">;

export type ServiceActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};
