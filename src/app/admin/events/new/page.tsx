import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EventForm } from "@/components/admin/events/event-form";

export default function NewEventPage() {
  return (
    <>
      <AdminPageHeader
        description="Completá la información de la actividad."
        title="Nuevo evento"
      />
      <EventForm />
    </>
  );
}
