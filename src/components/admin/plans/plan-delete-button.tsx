"use client";

import { deletePlan } from "@/app/admin/plans/actions";

export function PlanDeleteButton({ id, name }: Readonly<{ id: string; name: string }>) {
  return (
    <form action={deletePlan} onSubmit={(event) => { if (!window.confirm(`¿Eliminar “${name}”?\nEsta acción también eliminará sus características y no se puede deshacer.`)) event.preventDefault(); }}>
      <input name="id" type="hidden" value={id} />
      <button className="font-bold text-red-700 hover:text-red-900" type="submit">Eliminar</button>
    </form>
  );
}
