"use client";

import { deletePlan, togglePlanActive } from "@/app/admin/plans/actions";
import { AdminActionsMenu, AdminMenuAction } from "@/components/admin/admin-actions-menu";

export function PlanActionsMenu({ active, id, name }: Readonly<{ active: boolean; id: string; name: string }>) {
  return <AdminActionsMenu accessibleLabel={`Acciones para ${name}`}>
    <AdminMenuAction action={togglePlanActive} label={active ? "Desactivar" : "Activar"}>
      <input name="id" type="hidden" value={id} />
      <input name="active" type="hidden" value={String(!active)} />
    </AdminMenuAction>
    <AdminMenuAction action={deletePlan} confirmMessage={`¿Eliminar “${name}”?\nEsta acción también eliminará sus características y no se puede deshacer.`} destructive label="Eliminar">
      <input name="id" type="hidden" value={id} />
    </AdminMenuAction>
  </AdminActionsMenu>;
}
