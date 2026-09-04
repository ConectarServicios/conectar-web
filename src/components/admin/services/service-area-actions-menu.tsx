"use client";
import { deleteServiceArea, toggleServiceAreaActive } from "@/app/admin/services/areas/actions";
import { AdminActionsMenu, AdminMenuAction } from "@/components/admin/admin-actions-menu";
export function ServiceAreaActionsMenu({ active, id, name }: Readonly<{ active: boolean; id: string; name: string }>) {
  return <AdminActionsMenu accessibleLabel={`Acciones para ${name}`}>
    <AdminMenuAction action={toggleServiceAreaActive} label={active ? "Desactivar" : "Activar"}><input name="id" type="hidden" value={id} /><input name="active" type="hidden" value={String(!active)} /></AdminMenuAction>
    <AdminMenuAction action={deleteServiceArea} confirmMessage={`¿Eliminar “${name}”?`} destructive label="Eliminar"><input name="id" type="hidden" value={id} /></AdminMenuAction>
  </AdminActionsMenu>;
}
