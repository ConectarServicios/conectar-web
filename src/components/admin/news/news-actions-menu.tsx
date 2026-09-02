"use client";

import { deleteNews, toggleNewsFeatured, updateNewsState } from "@/app/admin/news/actions";
import { AdminActionsMenu, AdminMenuAction } from "@/components/admin/admin-actions-menu";
import type { NewsStatus } from "@/types/news";

export function NewsActionsMenu({ featured, id, status, title }: Readonly<{ featured: boolean; id: string; status: NewsStatus; title: string }>) {
  return <AdminActionsMenu accessibleLabel={`Acciones para ${title}`}>
    <AdminMenuAction action={updateNewsState} label={status === "published" ? "A borrador" : "Publicar"}>
      <input name="id" type="hidden" value={id} />
      <input name="status" type="hidden" value={status === "published" ? "draft" : "published"} />
    </AdminMenuAction>
    {status !== "archived" && <AdminMenuAction action={updateNewsState} label="Archivar">
      <input name="id" type="hidden" value={id} />
      <input name="status" type="hidden" value="archived" />
    </AdminMenuAction>}
    <AdminMenuAction action={toggleNewsFeatured} label={featured ? "Quitar destacado" : "Destacar"}>
      <input name="id" type="hidden" value={id} />
      <input name="featured" type="hidden" value={String(!featured)} />
    </AdminMenuAction>
    <AdminMenuAction action={deleteNews} confirmMessage={`¿Eliminar “${title}”?\nTambién se eliminará su imagen. Esta acción no se puede deshacer.`} destructive label="Eliminar">
      <input name="id" type="hidden" value={id} />
    </AdminMenuAction>
  </AdminActionsMenu>;
}
