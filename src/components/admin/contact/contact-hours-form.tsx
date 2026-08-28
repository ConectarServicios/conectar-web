"use client";

import { useActionState } from "react";

import { saveContactHours } from "@/app/admin/contact/actions";
import type { ContactInformationActionState } from "@/types/contact-information";

const initialState: ContactInformationActionState = {};

export function ContactHoursForm({ businessHours, guardHours }: Readonly<{ businessHours: string; guardHours: string }>) {
  const [state, action, pending] = useActionState(saveContactHours, initialState);
  const inputClassName = "mt-2 min-h-28 w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200";

  return (
    <form action={action} className="mt-6 max-w-2xl space-y-6">
      <label className="block text-sm font-semibold text-slate-700" htmlFor="business_hours">
        Horarios de atención
        <textarea className={inputClassName} defaultValue={businessHours} id="business_hours" maxLength={500} name="business_hours" required />
        {state.fieldErrors?.business_hours && <span className="mt-1 block text-xs text-red-700">{state.fieldErrors.business_hours}</span>}
      </label>
      <label className="block text-sm font-semibold text-slate-700" htmlFor="guard_hours">
        Horarios de guardia
        <textarea className={inputClassName} defaultValue={guardHours} id="guard_hours" maxLength={500} name="guard_hours" required />
        <span className="mt-1 block text-xs font-normal text-slate-500">La guardia usa el mismo WhatsApp institucional.</span>
        {state.fieldErrors?.guard_hours && <span className="mt-1 block text-xs text-red-700">{state.fieldErrors.guard_hours}</span>}
      </label>
      {state.message && <p className={`rounded-xl border px-4 py-3 text-sm ${state.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`} role={state.success ? "status" : "alert"}>{state.message}</p>}
      <button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">{pending ? "Guardando…" : "Guardar horarios"}</button>
    </form>
  );
}
