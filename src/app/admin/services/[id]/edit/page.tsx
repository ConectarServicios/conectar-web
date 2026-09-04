import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceForm } from "@/components/admin/services/service-form";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/types/services";

export default async function EditServicePage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data, error }, { data: areas }] = await Promise.all([
    supabase.from("services").select("id, name, slug, short_description, description, image_url, icon, category, service_area_id, featured, active, display_order").eq("id", id).maybeSingle(),
    supabase.from("service_areas").select("id, name").order("display_order"),
  ]);
  if (error) console.error("Unable to load service for editing", error);
  if (!data || error) notFound();
  const service = data as Service;
  const serviceId = service.id;
  const initialValues = {
    name: service.name, slug: service.slug, short_description: service.short_description,
    description: service.description, image_url: service.image_url, icon: service.icon,
    service_area_id: service.service_area_id, featured: service.featured,
    active: service.active, display_order: service.display_order,
  };
  return <><AdminPageHeader description={`Actualizá los datos y la presentación de ${service.name}.`} title="Editar servicio" /><ServiceForm areas={areas ?? []} id={serviceId} initialValues={initialValues} /></>;
}
