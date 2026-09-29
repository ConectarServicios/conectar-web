"use client";

import { useActionState } from "react";

import { saveMeshPricing } from "@/app/admin/mesh/actions";
import {
  ADMIN_FIELDSET_CLASS,
  ADMIN_FORM_CLASS,
  ADMIN_INPUT_CLASS,
} from "@/components/admin/admin-form-styles";
import type { MeshPricing, MeshPricingActionState, MeshPricingMode } from "@/types/mesh-pricing";

function initialPrice(rows: MeshPricing[], mode: MeshPricingMode, equipmentCount: number) {
  return rows.find((row) => row.mode === mode && row.equipment_count === equipmentCount)?.price;
}

function PriceField({
  equipmentCount,
  label,
  mode,
  rows,
  error,
}: Readonly<{
  equipmentCount: number;
  label: string;
  mode: MeshPricingMode;
  rows: MeshPricing[];
  error?: string;
}>) {
  const name = `${mode}_${equipmentCount}`;
  return (
    <label className="block text-sm font-semibold text-slate-800" htmlFor={name}>
      {label}
      <span className="relative mt-2 block max-w-52">
        <span aria-hidden="true" className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-500">$</span>
        <input
          className={`${ADMIN_INPUT_CLASS} mt-0 pl-8 tabular-nums`}
          defaultValue={initialPrice(rows, mode, equipmentCount)}
          id={name}
          inputMode="decimal"
          min="0"
          name={name}
          placeholder="Sin configurar"
          step="0.01"
          type="number"
        />
      </span>
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </label>
  );
}

export function MeshPricingForm({ rows }: Readonly<{ rows: MeshPricing[] }>) {
  const [state, action, pending] = useActionState(saveMeshPricing, {} as MeshPricingActionState);
  return (
    <form action={action} className={ADMIN_FORM_CLASS}>
      {state.message && (
        <p className={`rounded-xl border px-4 py-3 text-sm ${state.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`} role={state.success ? "status" : "alert"}>
          {state.message}
        </p>
      )}
      <p className="text-sm text-slate-600">Dejá un campo vacío para ocultar esa opción en la noticia.</p>
      <fieldset className={ADMIN_FIELDSET_CLASS}>
        <legend className="px-2 text-lg font-bold text-slate-950">Alquiler mensual</legend>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((count) => (
            <PriceField equipmentCount={count} error={state.fieldErrors?.[`rental_${count}`]} key={count} label={`${count} ${count === 1 ? "equipo" : "equipos"}`} mode="rental" rows={rows} />
          ))}
        </div>
      </fieldset>
      <fieldset className={ADMIN_FIELDSET_CLASS}>
        <legend className="px-2 text-lg font-bold text-slate-950">Compra</legend>
        <PriceField equipmentCount={1} error={state.fieldErrors?.purchase_1} label="Precio por equipo" mode="purchase" rows={rows} />
      </fieldset>
      <button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white disabled:opacity-60" disabled={pending}>
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
