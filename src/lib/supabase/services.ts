import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { Service, ServiceArea } from "@/types/services";

export type PublicResult<T> = { data: T; unavailable: boolean };
const areaFields = "id, name, slug, short_description, description, icon, public_url, featured, active, display_order";
const serviceFields = "id, name, slug, short_description, description, image_url, icon, category, service_area_id, featured, active, display_order";

export const getPublicServiceAreas = cache(async (): Promise<PublicResult<ServiceArea[]>> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("service_areas").select(areaFields).eq("active", true)
    .order("display_order", { ascending: true }).order("name", { ascending: true });
  if (error) { console.error("Unable to load public service areas", error); return { data: [], unavailable: true }; }
  return { data: (data ?? []) as ServiceArea[], unavailable: false };
});

export const getPublicServiceAreaBySlug = cache(async (slug: string): Promise<PublicResult<ServiceArea | null>> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("service_areas").select(areaFields).eq("slug", slug).eq("active", true).maybeSingle();
  if (error) { console.error("Unable to load public service area", error); return { data: null, unavailable: true }; }
  return { data: data as ServiceArea | null, unavailable: false };
});

export const getPublicServicesByArea = cache(async (areaId: string): Promise<PublicResult<Service[]>> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("services").select(serviceFields).eq("service_area_id", areaId).eq("active", true)
    .order("display_order", { ascending: true }).order("name", { ascending: true });
  if (error) { console.error("Unable to load public services by area", error); return { data: [], unavailable: true }; }
  return { data: (data ?? []) as Service[], unavailable: false };
});

export function serviceAreaHref(area: Pick<ServiceArea, "slug" | "public_url">) {
  return area.public_url ?? `/servicios/${area.slug}`;
}
