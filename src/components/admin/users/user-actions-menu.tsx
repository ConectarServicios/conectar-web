"use client";

import { setAdminUserActive } from "@/app/admin/users/actions";
import { AdminActionsMenu, AdminMenuAction } from "@/components/admin/admin-actions-menu";

export function UserActionsMenu({ active, disabled, id, name }: Readonly<{ active: boolean; disabled: boolean; id: string; name: string }>) {
  const action = setAdminUserActive.bind(null, id, !active);
  return <AdminActionsMenu accessibleLabel={`Acciones para ${name}`}>
    <AdminMenuAction
      action={action}
      confirmMessage={active ? `¿Desactivar el acceso de ${name}?` : undefined}
      disabled={disabled}
      label={active ? "Desactivar" : "Activar"}
      title={disabled ? "No podés desactivar tu propia cuenta" : undefined}
    >
      {null}
    </AdminMenuAction>
  </AdminActionsMenu>;
}
