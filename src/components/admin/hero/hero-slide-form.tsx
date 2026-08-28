"use client";

import Link from "next/link";
import { useActionState } from "react";

import { saveHeroSlide } from "@/app/admin/hero/actions";
import type { HeroActionState, HeroSlideFormValues } from "@/types/hero";

const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200";
const initialState: HeroActionState = {};

export function HeroSlideForm({ id, initialValues }: Readonly<{ id?: string; initialValues?: HeroSlideFormValues }>) {
  const [state, action, pending] = useActionState(saveHeroSlide, initialState);
  const error = (name: string) => state.fieldErrors?.[name];
  return (
    <form action={action} className="space-y-6">
      {id && <><input name="id" type="hidden" value={id} /><input name="current_image_path" type="hidden" value={initialValues?.image_path} /></>}
      {state.message && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{state.message}</p>}
      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold text-slate-950">Contenido</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Título<input className={inputClass} defaultValue={initialValues?.title} name="title" required />{error("title") && <span className="mt-1 block text-xs text-red-700">{error("title")}</span>}</label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Subtítulo<textarea className={`${inputClass} min-h-24 resize-y`} defaultValue={initialValues?.subtitle ?? ""} name="subtitle" /></label>
          <label className="text-sm font-semibold text-slate-700">Texto del botón (opcional)<input className={inputClass} defaultValue={initialValues?.button_text ?? ""} name="button_text" /></label>
          <label className="text-sm font-semibold text-slate-700">URL del botón (opcional)<input className={inputClass} defaultValue={initialValues?.button_url ?? ""} name="button_url" placeholder="/#planes o https://..." />{error("button_url") && <span className="mt-1 block text-xs text-red-700">{error("button_url")}</span>}</label>
        </div>
      </fieldset>
      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold text-slate-950">Imagen</legend>
        {initialValues?.image_path && <p className="mb-3 text-sm text-slate-600">Ya hay una imagen guardada. Elegí otra solo si querés reemplazarla.</p>}
        <label className="text-sm font-semibold text-slate-700">Archivo JPG, PNG o WebP (máximo 5 MB)<input accept="image/jpeg,image/png,image/webp" className={inputClass} name="image" required={!id} type="file" />{error("image") && <span className="mt-1 block text-xs text-red-700">{error("image")}</span>}</label>
      </fieldset>
      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold text-slate-950">Publicación</legend>
        <div className="grid items-end gap-5 sm:grid-cols-3">
          <label className="text-sm font-semibold text-slate-700">Orden<input className={inputClass} defaultValue={initialValues?.display_order ?? 0} min="0" name="display_order" required step="1" type="number" />{error("display_order") && <span className="mt-1 block text-xs text-red-700">{error("display_order")}</span>}</label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-700"><input className="size-5 accent-orange-600" defaultChecked={initialValues?.active ?? true} name="active" type="checkbox" /> Activo</label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-700"><input className="size-5 accent-orange-600" defaultChecked={initialValues?.featured} name="featured" type="checkbox" /> Principal / destacado</label>
        </div>
      </fieldset>
      <div className="flex justify-end gap-3"><Link className="rounded-xl border border-slate-300 px-5 py-2.5 font-bold text-slate-700 hover:bg-slate-100" href="/admin/hero">Cancelar</Link><button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white hover:bg-orange-700 disabled:opacity-60" disabled={pending} type="submit">{pending ? "Guardando…" : "Guardar slide"}</button></div>
    </form>
  );
}
