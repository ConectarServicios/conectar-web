import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceAreaForm } from "@/components/admin/services/service-area-form";
import { createClient } from "@/lib/supabase/server";
import type { ServiceArea } from "@/types/services";
export default async function EditServiceAreaPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params; const supabase = await createClient();
  const { data, error } = await supabase.from("service_areas").select("id, name, slug, short_description, description, icon, public_url, featured, active, display_order").eq("id", id).maybeSingle();
  if (error || !data) notFound(); const area = data as ServiceArea; const { id: areaId, ...initialValues } = area;
  return <><AdminPageHeader description={`Actualizá la información de ${area.name}.`} title="Editar área de servicio" /><ServiceAreaForm id={areaId} initialValues={initialValues} /></>;
}
