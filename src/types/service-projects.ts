import type { Service, ServiceArea } from "@/types/services";

export type ServiceProject = {
  id: string;
  service_area_id: string;
  service_id: string | null;
  title: string;
  slug: string;
  project_type: string | null;
  short_description: string | null;
  description: string | null;
  image_path: string | null;
  public_url: string | null;
  featured: boolean;
  active: boolean;
  display_order: number;
  service_areas?: Pick<ServiceArea, "id" | "name" | "slug" | "icon"> | null;
  services?: Pick<Service, "id" | "name"> | null;
};

export type ServiceProjectFormValues = Omit<ServiceProject, "id" | "service_areas" | "services">;
export type ServiceProjectActionState = { message?: string; fieldErrors?: Record<string, string> };
