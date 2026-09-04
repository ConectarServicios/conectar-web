"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { saveServiceArea } from "@/app/admin/services/areas/actions";
import { slugifyServiceName } from "@/lib/validations/services";
import type { ServiceActionState, ServiceAreaFormValues } from "@/types/services";
const input = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200";
export function ServiceAreaForm({ id, initialValues }: Readonly<{ id?: string; initialValues?: ServiceAreaFormValues }>) {
  const [state, action, pending] = useActionState(saveServiceArea, {} as ServiceActionState);
  const [slug, setSlug] = useState(initialValues?.slug ?? ""); const [touched, setTouched] = useState(Boolean(initialValues));
  const error = (key: string) => state.fieldErrors?.[key];
  return <form action={action} className="space-y-6">{id && <input name="id" type="hidden" value={id} />}
    {state.message && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{state.message}</p>}
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><legend className="px-2 text-lg font-bold">Datos del área</legend><div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-semibold">Nombre<input className={input} defaultValue={initialValues?.name} name="name" required onChange={(e) => { if (!touched) setSlug(slugifyServiceName(e.target.value)); }} />{error("name") && <span className="text-xs text-red-700">{error("name")}</span>}</label>
      <label className="text-sm font-semibold">Slug<input className={input} name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required value={slug} onChange={(e) => { setTouched(true); setSlug(e.target.value); }} />{error("slug") && <span className="text-xs text-red-700">{error("slug")}</span>}</label>
      <label className="text-sm font-semibold sm:col-span-2">Descripción corta<textarea className={`${input} min-h-20`} defaultValue={initialValues?.short_description ?? ""} name="short_description" /></label>
      <label className="text-sm font-semibold sm:col-span-2">Descripción completa<textarea className={`${input} min-h-36`} defaultValue={initialValues?.description ?? ""} name="description" /></label>
      <label className="text-sm font-semibold">Icono <span className="font-normal text-slate-500">(opcional)</span><input className={input} defaultValue={initialValues?.icon ?? ""} name="icon" /></label>
      <label className="text-sm font-semibold">URL pública <span className="font-normal text-slate-500">(opcional)</span><input className={input} defaultValue={initialValues?.public_url ?? ""} name="public_url" placeholder="/ruta o https://..." />{error("public_url") && <span className="text-xs text-red-700">{error("public_url")}</span>}</label>
      <label className="text-sm font-semibold">Orden<input className={input} defaultValue={initialValues?.display_order ?? 0} min="0" name="display_order" required type="number" />{error("display_order") && <span className="text-xs text-red-700">{error("display_order")}</span>}</label>
      <div className="flex flex-wrap items-end gap-6"><label className="flex gap-2 text-sm font-semibold"><input defaultChecked={initialValues?.featured} name="featured" type="checkbox" /> Destacada</label><label className="flex gap-2 text-sm font-semibold"><input defaultChecked={initialValues?.active ?? true} name="active" type="checkbox" /> Activa</label></div>
    </div></fieldset><div className="flex justify-end gap-3"><Link className="rounded-xl border border-slate-300 px-5 py-2.5 font-bold" href="/admin/services/areas">Cancelar</Link><button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white disabled:opacity-60" disabled={pending}>{pending ? "Guardando…" : "Guardar área"}</button></div>
  </form>;
}
