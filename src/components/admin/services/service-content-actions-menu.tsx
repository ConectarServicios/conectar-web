"use client";

import {
  deleteServiceMedia,
  deleteServiceOption,
} from "@/app/admin/services/content-actions";
import {
  AdminActionsMenu,
  AdminMenuAction,
} from "@/components/admin/admin-actions-menu";

type ServiceContentActionsMenuProps = Readonly<{
  id: string;
  kind: "media" | "option";
  name: string;
  serviceId: string;
}>;

export function ServiceContentActionsMenu({
  id,
  kind,
  name,
  serviceId,
}: ServiceContentActionsMenuProps) {
  const action = kind === "option" ? deleteServiceOption : deleteServiceMedia;
  const itemLabel = kind === "option" ? "la opción" : "el medio";

  return (
    <AdminActionsMenu accessibleLabel={`Acciones para ${name}`}>
      <AdminMenuAction
        action={action}
        confirmMessage={`¿Eliminar ${itemLabel} “${name}”?\nEsta acción no se puede deshacer.`}
        destructive
        label="Eliminar"
      >
        <input name="service_id" type="hidden" value={serviceId} />
        <input name="id" type="hidden" value={id} />
      </AdminMenuAction>
    </AdminActionsMenu>
  );
}
