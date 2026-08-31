"use client";

import Link from "next/link";
import { useActionState } from "react";

import { saveFaq } from "@/app/admin/faqs/actions";
import { FAQ_CATEGORIES, type FaqActionState, type FaqFormValues } from "@/types/faqs";

const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200";

export function FaqForm({ id, initialValues }: Readonly<{ id?: string; initialValues?: FaqFormValues }>) {
  const [state, action, pending] = useActionState(saveFaq, {} as FaqActionState);
  const error = (key: string) => state.fieldErrors?.[key];
  return (
    <form action={action} className="space-y-6">
      {id && <input name="id" type="hidden" value={id} />}
      {state.message && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{state.message}</p>}
      <fieldset className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold">Contenido</legend>
        <div className="grid gap-5">
          <label className="text-sm font-semibold">Pregunta *
            <textarea className={`${inputClass} min-h-24`} defaultValue={initialValues?.question} name="question" required />
            <FieldError message={error("question")} />
          </label>
          <label className="text-sm font-semibold">Respuesta *
            <textarea className={`${inputClass} min-h-56`} defaultValue={initialValues?.answer} name="answer" required />
            <span className="mt-1 block text-xs font-normal text-slate-500">Texto plano. Los saltos de línea se conservarán.</span>
            <FieldError message={error("answer")} />
          </label>
        </div>
      </fieldset>
      <fieldset className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold">Organización y publicación</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">Categoría *
            <select className={inputClass} defaultValue={initialValues?.category ?? "General"} name="category" required>
              {FAQ_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
            <FieldError message={error("category")} />
          </label>
          <label className="text-sm font-semibold">Orden de visualización
            <input className={inputClass} defaultValue={initialValues?.display_order ?? 0} min={0} name="display_order" required step={1} type="number" />
            <FieldError message={error("display_order")} />
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold"><input className="size-5 accent-orange-600" defaultChecked={initialValues?.active ?? true} name="active" type="checkbox" />Activa</label>
          <label className="flex items-center gap-3 text-sm font-semibold"><input className="size-5 accent-orange-600" defaultChecked={initialValues?.featured ?? false} name="featured" type="checkbox" />Destacada en Home</label>
        </div>
      </fieldset>
      <div className="flex flex-wrap justify-end gap-3">
        <Link className="rounded-xl border px-5 py-2.5 font-bold" href="/admin/faqs">Cancelar</Link>
        <button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white disabled:opacity-60" disabled={pending}>{pending ? "Guardando…" : "Guardar pregunta"}</button>
      </div>
    </form>
  );
}

function FieldError({ message }: Readonly<{ message?: string }>) {
  return message ? <span className="mt-1 block text-xs text-red-700">{message}</span> : null;
}
