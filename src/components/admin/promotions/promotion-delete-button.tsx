"use client";

import { deletePromotion } from "@/app/admin/promotions/actions";

export function PromotionDeleteButton({ id, title }: Readonly<{ id: string; title: string }>) {
  return (
    <form action={deletePromotion} onSubmit={(event) => {
      if (!confirm(`¿Eliminar “${title}”? Esta acción no se puede deshacer.`)) event.preventDefault();
    }}>
      <input name="id" type="hidden" value={id} />
      <button className="font-bold text-red-700">Eliminar</button>
    </form>
  );
}
