"use client";

import { deletePlayItem } from "@/app/admin/conectar-play/actions";

type ConectarPlayTable =
  | "conectar_play_plans"
  | "conectar_play_packs"
  | "conectar_play_faqs";

type ConectarPlayDeleteButtonProps = Readonly<{
  id: string;
  itemName: string;
  itemType: "plan" | "pack adicional" | "pregunta frecuente";
  table: ConectarPlayTable;
}>;

export function ConectarPlayDeleteButton({
  id,
  itemName,
  itemType,
  table,
}: ConectarPlayDeleteButtonProps) {
  return (
    <form
      action={deletePlayItem}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `¿Eliminar ${itemType} “${itemName}”?\nEsta acción no se puede deshacer.`,
        );

        if (!confirmed) event.preventDefault();
      }}
    >
      <input name="id" type="hidden" value={id} />
      <input name="table" type="hidden" value={table} />
      <button
        className="text-sm font-bold text-red-700 hover:text-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        type="submit"
      >
        Eliminar
      </button>
    </form>
  );
}
