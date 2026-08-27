import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceForm } from "@/components/admin/services/service-form";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/types/services";

export default async function EditServicePage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("services")
    .select("id, name, slug, short_description, description, image_url, icon, category, featured, active, display_order")
    .eq("id", id).maybeSingle();
  if (error) console.error("Unable to load service for editing", error);
  if (!data || error) notFound();
  const service = data as Service;
  const { id: serviceId, ...initialValues } = service;
  return <><AdminPageHeader description={`Actualizá los datos y la presentación de ${service.name}.`} title="Editar servicio" /><ServiceForm id={serviceId} initialValues={initialValues} /></>;
}
