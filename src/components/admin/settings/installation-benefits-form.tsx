"use client";

import { useActionState } from "react";

import { saveInstallationBenefitsText } from "@/app/admin/settings/actions";
import type { InstallationBenefitsActionState } from "@/types/site-settings";

const initialState: InstallationBenefitsActionState = {};

export function InstallationBenefitsForm({ currentValue }: Readonly<{ currentValue: string }>) {
  const [state, action, pending] = useActionState(saveInstallationBenefitsText, initialState);

  return (
    <form action={action} className="max-w-xl space-y-5 border-t border-slate-200 pt-6">
      <label className="block text-sm font-semibold text-slate-700" htmlFor="installation_benefits_text">
        Texto de beneficios de instalación
        <textarea
          className="mt-2 min-h-28 w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          defaultValue={currentValue}
          id="installation_benefits_text"
          name="installation_benefits_text"
          required
        />
        {state.fieldError && <span className="mt-1 block text-xs text-red-700">{state.fieldError}</span>}
      </label>
      {state.message && <p className={`rounded-xl border px-4 py-3 text-sm ${state.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`} role={state.success ? "status" : "alert"}>{state.message}</p>}
      <button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">{pending ? "Guardando…" : "Guardar configuración"}</button>
    </form>
  );
}
