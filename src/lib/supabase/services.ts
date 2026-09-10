import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PublicService, Service, ServiceArea, ServiceMedia, ServiceOption } from "@/types/services";

export const SERVICE_MEDIA_BUCKET = "service-media";

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

export const getFeaturedServices = cache(async (limit = 3): Promise<PublicResult<PublicService[]>> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("services")
    .select(`${serviceFields}, service_areas!inner(id, name, slug), service_media(id, service_id, type, image_path, alt_text, caption, active, display_order)`)
    .eq("active", true).eq("featured", true).eq("service_areas.active", true)
    .eq("service_media.active", true).eq("service_media.type", "hero")
    .order("display_order", { ascending: true }).order("name", { ascending: true }).limit(limit);
  if (error) { console.error("Unable to load featured services", error); return { data: [], unavailable: true }; }
  return { data: (data ?? []) as unknown as PublicService[], unavailable: false };
});

export const getPublicServiceBySlugs = cache(async (areaSlug: string, serviceSlug: string): Promise<PublicResult<PublicService | null>> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("services")
    .select(`${serviceFields}, service_areas!inner(id, name, slug), service_options(id, service_id, title, mode, equipment_count, price, price_label, description, active, display_order), service_media(id, service_id, type, image_path, alt_text, caption, active, display_order)`)
    .eq("slug", serviceSlug).eq("active", true).eq("service_areas.slug", areaSlug).eq("service_areas.active", true)
    .eq("service_options.active", true).eq("service_media.active", true)
    .order("display_order", { referencedTable: "service_options", ascending: true })
    .order("display_order", { referencedTable: "service_media", ascending: true }).maybeSingle();
  if (error) { console.error("Unable to load public service", error); return { data: null, unavailable: true }; }
  return { data: data as unknown as PublicService | null, unavailable: false };
});

export const getActiveServiceOptions = cache(async (serviceId: string): Promise<PublicResult<ServiceOption[]>> => {
  const supabase = await createClient(); const { data, error } = await supabase.from("service_options").select("id, service_id, title, mode, equipment_count, price, price_label, description, active, display_order").eq("service_id", serviceId).eq("active", true).order("display_order").order("title");
  if (error) return { data: [], unavailable: true }; return { data: (data ?? []) as ServiceOption[], unavailable: false };
});
export const getActiveServiceMedia = cache(async (serviceId: string): Promise<PublicResult<ServiceMedia[]>> => {
  const supabase = await createClient(); const { data, error } = await supabase.from("service_media").select("id, service_id, type, image_path, alt_text, caption, active, display_order").eq("service_id", serviceId).eq("active", true).order("display_order");
  if (error) return { data: [], unavailable: true }; return { data: (data ?? []) as ServiceMedia[], unavailable: false };
});

export function serviceMediaUrl(supabase: SupabaseClient, path: string | null) { return path ? supabase.storage.from(SERVICE_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl : null; }
export function serviceHref(areaSlug: string, serviceSlug: string) { return `/servicios/${areaSlug}/${serviceSlug}`; }

export function serviceAreaHref(area: Pick<ServiceArea, "slug" | "public_url">) {
  return area.public_url ?? `/servicios/${area.slug}`;
}
