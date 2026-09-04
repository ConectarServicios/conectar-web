import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceProjectForm } from "@/components/admin/services/service-project-form";
import { serviceProjectImageUrl } from "@/lib/supabase/service-projects";
import { createClient } from "@/lib/supabase/server";
import type { ServiceProject } from "@/types/service-projects";
export default async function EditServiceProjectPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params; const supabase = await createClient();
  const [{ data, error }, { data: areas }, { data: services }] = await Promise.all([
    supabase.from("service_projects").select("id, service_area_id, service_id, title, slug, project_type, short_description, description, image_path, public_url, featured, active, display_order").eq("id", id).maybeSingle(),
    supabase.from("service_areas").select("id, name").order("display_order"),
    supabase.from("services").select("id, name, service_area_id").order("name"),
  ]);
  if (error) console.error("Unable to load service project for editing", error);
  if (!data || error) notFound(); const project = data as ServiceProject;
  return <><AdminPageHeader description={`Actualizá los datos de ${project.title}.`} title="Editar proyecto / solución"/><ServiceProjectForm areas={areas ?? []} currentImageUrl={serviceProjectImageUrl(supabase, project.image_path)} id={project.id} initialValues={project} services={services ?? []}/></>;
}
