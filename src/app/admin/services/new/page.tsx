import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceForm } from "@/components/admin/services/service-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewServicePage() {
  const supabase = await createClient();
  const { data: areas } = await supabase.from("service_areas").select("id, name").order("display_order");
  return <><AdminPageHeader description="Completá los datos y la presentación del nuevo servicio." title="Nuevo servicio" /><ServiceForm areas={areas ?? []} /></>;
}
