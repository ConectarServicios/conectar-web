import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { ServiceProject } from "@/types/service-projects";
import type { PublicResult } from "@/lib/supabase/services";

export const SERVICE_PROJECTS_BUCKET = "service-project-images";
const fields = "id, service_area_id, service_id, title, slug, project_type, short_description, description, image_path, public_url, featured, active, display_order";

export function serviceProjectImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, path: string | null) {
  return path ? supabase.storage.from(SERVICE_PROJECTS_BUCKET).getPublicUrl(path).data.publicUrl : null;
}

export const getPublicServiceProjectsByArea = cache(async (areaId: string): Promise<PublicResult<ServiceProject[]>> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("service_projects").select(fields)
    .eq("service_area_id", areaId).eq("active", true)
    .order("featured", { ascending: false }).order("display_order", { ascending: true }).order("title", { ascending: true });
  if (error) { console.error("Unable to load public service projects", error); return { data: [], unavailable: true }; }
  return { data: (data ?? []) as ServiceProject[], unavailable: false };
});
