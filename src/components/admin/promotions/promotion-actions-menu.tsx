"use client";

import { deletePromotion, togglePromotionActive, togglePromotionFeatured } from "@/app/admin/promotions/actions";
import { AdminActionsMenu, AdminMenuAction } from "@/components/admin/admin-actions-menu";

export function PromotionActionsMenu({ active, featured, id, title }: Readonly<{ active: boolean; featured: boolean; id: string; title: string }>) {
  return <AdminActionsMenu accessibleLabel={`Acciones para ${title}`}>
    <AdminMenuAction action={togglePromotionActive} label={active ? "Desactivar" : "Activar"}>
      <input name="id" type="hidden" value={id} /><input name="value" type="hidden" value={String(!active)} />
    </AdminMenuAction>
    <AdminMenuAction action={togglePromotionFeatured} label={featured ? "Quitar destacado" : "Destacar"}>
      <input name="id" type="hidden" value={id} /><input name="value" type="hidden" value={String(!featured)} />
    </AdminMenuAction>
    <AdminMenuAction action={deletePromotion} confirmMessage={`¿Eliminar “${title}”? Esta acción no se puede deshacer.`} destructive label="Eliminar">
      <input name="id" type="hidden" value={id} />
    </AdminMenuAction>
  </AdminActionsMenu>;
}
