"use client";

import { deleteHeroSlide, featureHeroSlide, toggleHeroSlide } from "@/app/admin/hero/actions";
import { AdminActionsMenu, AdminMenuAction } from "@/components/admin/admin-actions-menu";

export function HeroActionsMenu({ active, featured, id, title }: Readonly<{ active: boolean; featured: boolean; id: string; title: string }>) {
  return <AdminActionsMenu accessibleLabel={`Acciones para ${title}`}>
    <AdminMenuAction action={toggleHeroSlide} label={active ? "Desactivar" : "Activar"}>
      <input name="id" type="hidden" value={id} /><input name="active" type="hidden" value={String(!active)} />
    </AdminMenuAction>
    {!featured && <AdminMenuAction action={featureHeroSlide} label="Hacer principal">
      <input name="id" type="hidden" value={id} />
    </AdminMenuAction>}
    <AdminMenuAction action={deleteHeroSlide} confirmMessage={`¿Eliminar “${title}” y su imagen? Esta acción no se puede deshacer.`} destructive label="Eliminar">
      <input name="id" type="hidden" value={id} />
    </AdminMenuAction>
  </AdminActionsMenu>;
}
