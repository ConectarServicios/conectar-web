"use client";

import { deleteEvent } from "@/app/admin/events/actions";

export function EventDeleteButton({
  id,
  title,
}: Readonly<{ id: string; title: string }>) {
  return (
    <form
      action={deleteEvent}
      onSubmit={(event) => {
        if (!confirm(`¿Eliminar “${title}”? Esta acción no se puede deshacer.`)) {
          event.preventDefault();
        }
      }}
    >
      <input name="id" type="hidden" value={id} />
      <button className="font-bold text-red-700">Eliminar</button>
    </form>
  );
}
