import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceProjectForm } from "@/components/admin/services/service-project-form";
import { createClient } from "@/lib/supabase/server";
export default async function NewServiceProjectPage() {
  const supabase = await createClient();
  const [{ data: areas }, { data: services }] = await Promise.all([
    supabase.from("service_areas").select("id, name").order("display_order"),
    supabase.from("services").select("id, name, service_area_id").order("name"),
  ]);
  return <><AdminPageHeader description="Registrá una solución desarrollada o implementada por Conectar Servicios." title="Nuevo proyecto / solución"/><ServiceProjectForm areas={areas ?? []} services={services ?? []}/></>;
}
