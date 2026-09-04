"use client";
import { deleteServiceProject, toggleServiceProjectActive, toggleServiceProjectFeatured } from "@/app/admin/services/projects/actions";
import { AdminActionsMenu, AdminMenuAction } from "@/components/admin/admin-actions-menu";
export function ServiceProjectActionsMenu({ active, featured, id, title }: Readonly<{ active: boolean; featured: boolean; id: string; title: string }>) {
  return <AdminActionsMenu accessibleLabel={`Acciones para ${title}`}>
    <AdminMenuAction action={toggleServiceProjectActive} label={active ? "Desactivar" : "Activar"}><input name="id" type="hidden" value={id}/><input name="active" type="hidden" value={String(!active)}/></AdminMenuAction>
    <AdminMenuAction action={toggleServiceProjectFeatured} label={featured ? "Quitar destacado" : "Destacar"}><input name="id" type="hidden" value={id}/><input name="featured" type="hidden" value={String(!featured)}/></AdminMenuAction>
    <AdminMenuAction action={deleteServiceProject} confirmMessage={`¿Eliminar “${title}”?\nEsta acción no se puede deshacer.`} destructive label="Eliminar"><input name="id" type="hidden" value={id}/></AdminMenuAction>
  </AdminActionsMenu>;
}
