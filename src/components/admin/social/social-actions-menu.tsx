"use client";

import { deleteSocialLink, toggleSocialLink } from "@/app/admin/social/actions";
import { AdminActionsMenu, AdminMenuAction } from "@/components/admin/admin-actions-menu";

export function SocialActionsMenu({ active, id, platform }: Readonly<{ active: boolean; id: string; platform: string }>) {
  return <AdminActionsMenu accessibleLabel={`Acciones para ${platform}`}>
    <AdminMenuAction action={toggleSocialLink} label={active ? "Desactivar" : "Activar"}>
      <input name="id" type="hidden" value={id} /><input name="active" type="hidden" value={String(!active)} />
    </AdminMenuAction>
    <AdminMenuAction action={deleteSocialLink} confirmMessage={`¿Eliminar el enlace de ${platform}?\nEsta acción no se puede deshacer.`} destructive label="Eliminar">
      <input name="id" type="hidden" value={id} />
    </AdminMenuAction>
  </AdminActionsMenu>;
}
