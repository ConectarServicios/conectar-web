"use client";

import { useActionState } from "react";

import { saveInstallationPrice } from "@/app/admin/settings/actions";
import type { InstallationPriceActionState } from "@/types/site-settings";

const initialState: InstallationPriceActionState = {};

export function InstallationPriceForm({ currentValue }: Readonly<{ currentValue: number | null }>) {
  const [state, action, pending] = useActionState(saveInstallationPrice, initialState);

  return (
    <form action={action} className="mt-6 max-w-xl space-y-5">
      <label className="block text-sm font-semibold text-slate-700" htmlFor="installation_price">
        Precio de instalación
        <input
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          defaultValue={currentValue ?? ""}
          id="installation_price"
          min="0"
          name="installation_price"
          required
          step="0.01"
          type="number"
        />
        <span className="mt-1 block text-xs font-normal text-slate-500">Importe en pesos argentinos, sin símbolo de moneda.</span>
        {state.fieldError && <span className="mt-1 block text-xs text-red-700">{state.fieldError}</span>}
      </label>
      {state.message && <p className={`rounded-xl border px-4 py-3 text-sm ${state.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`} role={state.success ? "status" : "alert"}>{state.message}</p>}
      <button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">{pending ? "Guardando…" : "Guardar configuración"}</button>
    </form>
  );
}
