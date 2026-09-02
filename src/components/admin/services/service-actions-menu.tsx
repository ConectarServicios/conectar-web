"use client";

import { deleteService, toggleServiceActive } from "@/app/admin/services/actions";
import { AdminActionsMenu, AdminMenuAction } from "@/components/admin/admin-actions-menu";

export function ServiceActionsMenu({ active, id, name }: Readonly<{ active: boolean; id: string; name: string }>) {
  return <AdminActionsMenu accessibleLabel={`Acciones para ${name}`}>
    <AdminMenuAction action={toggleServiceActive} label={active ? "Desactivar" : "Activar"}>
      <input name="id" type="hidden" value={id} />
      <input name="active" type="hidden" value={String(!active)} />
    </AdminMenuAction>
    <AdminMenuAction action={deleteService} confirmMessage={`¿Eliminar “${name}”?\nEsta acción no se puede deshacer.`} destructive label="Eliminar">
      <input name="id" type="hidden" value={id} />
    </AdminMenuAction>
  </AdminActionsMenu>;
}
