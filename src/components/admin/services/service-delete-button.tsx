"use client";

import { deleteService } from "@/app/admin/services/actions";

export function ServiceDeleteButton({ id, name }: Readonly<{ id: string; name: string }>) {
  return (
    <form action={deleteService} onSubmit={(event) => { if (!window.confirm(`¿Eliminar “${name}”?\nEsta acción no se puede deshacer.`)) event.preventDefault(); }}>
      <input name="id" type="hidden" value={id} />
      <button className="font-bold text-red-700 hover:text-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" type="submit">Eliminar</button>
    </form>
  );
}
