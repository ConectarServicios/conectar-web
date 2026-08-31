import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EventForm } from "@/components/admin/events/event-form";
import { EVENT_SELECT } from "@/lib/supabase/events";
import { createClient } from "@/lib/supabase/server";
import type { EventItem } from "@/types/events";

export default async function EditEventPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const item = data as EventItem;
  const { id: itemId, created_at: createdAt, updated_at: updatedAt, ...values } = item;
  void createdAt;
  void updatedAt;

  return (
    <>
      <AdminPageHeader description={`Actualizá “${item.title}”.`} title="Editar evento" />
      <EventForm id={itemId} initialValues={values} />
    </>
  );
}
