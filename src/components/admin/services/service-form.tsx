"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { saveService } from "@/app/admin/services/actions";
import { slugifyServiceName } from "@/lib/validations/services";
import type { ServiceActionState, ServiceFormValues } from "@/types/services";

const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200";
const initialState: ServiceActionState = {};

export function ServiceForm({ id, initialValues }: Readonly<{ id?: string; initialValues?: ServiceFormValues }>) {
  const [state, action, pending] = useActionState(saveService, initialState);
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues));
  const error = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={action} className="space-y-6">
      {id && <input name="id" type="hidden" value={id} />}
      {state.message && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{state.message}</div>}

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold text-slate-950">Datos principales</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">Nombre
            <input className={inputClass} defaultValue={initialValues?.name} name="name" required onChange={(event) => { if (!slugTouched) setSlug(slugifyServiceName(event.target.value)); }} />
            {error("name") && <span className="mt-1 block text-xs text-red-700">{error("name")}</span>}
          </label>
          <label className="text-sm font-semibold text-slate-700">Slug
            <input className={inputClass} name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required value={slug} onChange={(event) => { setSlugTouched(true); setSlug(event.target.value); }} />
            <span className="mt-1 block text-xs font-normal text-slate-500">Se genera desde el nombre y podés editarlo.</span>
            {error("slug") && <span className="mt-1 block text-xs text-red-700">{error("slug")}</span>}
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Categoría <span className="font-normal text-slate-500">(opcional)</span>
            <input className={inputClass} defaultValue={initialValues?.category ?? ""} name="category" />
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Descripción corta <span className="font-normal text-slate-500">(opcional)</span>
            <textarea className={`${inputClass} min-h-20 resize-y`} defaultValue={initialValues?.short_description ?? ""} name="short_description" />
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Descripción completa <span className="font-normal text-slate-500">(opcional)</span>
            <textarea className={`${inputClass} min-h-36 resize-y`} defaultValue={initialValues?.description ?? ""} name="description" />
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold text-slate-950">Presentación</legend>
        <div className="grid items-end gap-5 sm:grid-cols-3">
          <label className="text-sm font-semibold text-slate-700">Orden de visualización
            <input className={inputClass} defaultValue={initialValues?.display_order ?? 0} min="0" name="display_order" required step="1" type="number" />
            {error("display_order") && <span className="mt-1 block text-xs text-red-700">{error("display_order")}</span>}
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-700"><input className="size-5 accent-orange-600" defaultChecked={initialValues?.featured} name="featured" type="checkbox" /> Destacado</label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-700"><input className="size-5 accent-orange-600" defaultChecked={initialValues?.active ?? true} name="active" type="checkbox" /> Activo</label>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold text-slate-950">Recursos visuales</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">URL de imagen <span className="font-normal text-slate-500">(opcional)</span>
            <input className={inputClass} defaultValue={initialValues?.image_url ?? ""} name="image_url" placeholder="https://..." type="text" />
            <span className="mt-1 block text-xs font-normal text-slate-500">Ingresá una URL como texto. La carga de archivos se incorporará más adelante.</span>
          </label>
          <label className="text-sm font-semibold text-slate-700">Icono <span className="font-normal text-slate-500">(opcional)</span>
            <input className={inputClass} defaultValue={initialValues?.icon ?? ""} name="icon" placeholder="Ej. wifi" type="text" />
            <span className="mt-1 block text-xs font-normal text-slate-500">Ingresá el identificador del icono como texto libre.</span>
          </label>
        </div>
      </fieldset>

      <div className="flex flex-wrap justify-end gap-3">
        <Link className="rounded-xl border border-slate-300 px-5 py-2.5 font-bold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600" href="/admin/services">Cancelar</Link>
        <button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">{pending ? "Guardando…" : "Guardar servicio"}</button>
      </div>
    </form>
  );
}
