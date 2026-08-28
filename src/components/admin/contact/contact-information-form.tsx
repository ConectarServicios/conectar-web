"use client";

import { useActionState } from "react";

import { saveContactInformation } from "@/app/admin/contact/actions";
import type { ContactInformation, ContactInformationActionState } from "@/types/contact-information";

const initialState: ContactInformationActionState = {};
const inputClassName = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200";

type EditableContact = Omit<ContactInformation, "id">;

function FieldError({ message }: Readonly<{ message?: string }>) {
  return message ? <span className="mt-1 block text-xs text-red-700">{message}</span> : null;
}

export function ContactInformationForm({ contact }: Readonly<{ contact: EditableContact }>) {
  const [state, action, pending] = useActionState(saveContactInformation, initialState);

  return (
    <form action={action} className="mt-6 max-w-3xl space-y-8">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-base font-bold text-slate-950">Canales institucionales</legend>
        <label className="block text-sm font-semibold text-slate-700" htmlFor="phone">Teléfono <span className="font-normal text-slate-500">(opcional)</span><input className={inputClassName} defaultValue={contact.phone ?? ""} id="phone" maxLength={500} name="phone" type="tel" /><FieldError message={state.fieldErrors?.phone} /></label>
        <label className="block text-sm font-semibold text-slate-700" htmlFor="whatsapp">WhatsApp<input className={inputClassName} defaultValue={contact.whatsapp ?? ""} id="whatsapp" maxLength={500} name="whatsapp" required type="tel" /><FieldError message={state.fieldErrors?.whatsapp} /></label>
        <label className="block text-sm font-semibold text-slate-700" htmlFor="commercial_email">Email comercial<input className={inputClassName} defaultValue={contact.commercial_email ?? ""} id="commercial_email" maxLength={500} name="commercial_email" required type="email" /><FieldError message={state.fieldErrors?.commercial_email} /></label>
        <label className="block text-sm font-semibold text-slate-700" htmlFor="address">Dirección<input className={inputClassName} defaultValue={contact.address ?? ""} id="address" maxLength={500} name="address" required /><FieldError message={state.fieldErrors?.address} /></label>
      </fieldset>
      <fieldset className="grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2">
        <legend className="mb-4 text-base font-bold text-slate-950">Disponibilidad</legend>
        <label className="block text-sm font-semibold text-slate-700" htmlFor="business_hours">Horarios de atención<textarea className={`${inputClassName} min-h-32 resize-y`} defaultValue={contact.business_hours ?? ""} id="business_hours" maxLength={500} name="business_hours" required /><FieldError message={state.fieldErrors?.business_hours} /></label>
        <label className="block text-sm font-semibold text-slate-700" htmlFor="guard_hours">Horarios de guardia<textarea className={`${inputClassName} min-h-32 resize-y`} defaultValue={contact.guard_hours ?? ""} id="guard_hours" maxLength={500} name="guard_hours" required /><span className="mt-1 block text-xs font-normal text-slate-500">La guardia usa el mismo WhatsApp institucional.</span><FieldError message={state.fieldErrors?.guard_hours} /></label>
      </fieldset>
      {state.message && <p className={`rounded-xl border px-4 py-3 text-sm ${state.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`} role={state.success ? "status" : "alert"}>{state.message}</p>}
      <button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">{pending ? "Guardando…" : "Guardar datos de contacto"}</button>
    </form>
  );
}
