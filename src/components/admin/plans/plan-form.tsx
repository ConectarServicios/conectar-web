"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { savePlan } from "@/app/admin/plans/actions";
import { slugifyPlanName } from "@/lib/validations/plans";
import type { PlanActionState, PlanFormValues } from "@/types/plans";

const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200";
const initialState: PlanActionState = {};

function localDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function PlanForm({ id, initialValues }: Readonly<{ id?: string; initialValues?: PlanFormValues }>) {
  const [state, action, pending] = useActionState(savePlan, initialState);
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues));
  const [features, setFeatures] = useState(initialValues?.plan_features ?? []);
  const initialStart = localDateTime(initialValues?.promotion_start ?? null);
  const initialEnd = localDateTime(initialValues?.promotion_end ?? null);
  const [promotionStart, setPromotionStart] = useState(initialValues?.promotion_start ?? "");
  const [promotionEnd, setPromotionEnd] = useState(initialValues?.promotion_end ?? "");
  const error = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={action} className="space-y-6">
      {id && <input name="id" type="hidden" value={id} />}
      <input name="features" type="hidden" value={JSON.stringify(features)} />
      <input name="promotion_start" type="hidden" value={promotionStart} />
      <input name="promotion_end" type="hidden" value={promotionEnd} />
      {state.message && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{state.message}</div>}

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold text-slate-950">Datos principales</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">Nombre
            <input className={inputClass} defaultValue={initialValues?.name} name="name" required onChange={(event) => { if (!slugTouched) setSlug(slugifyPlanName(event.target.value)); }} />
            {error("name") && <span className="mt-1 block text-xs text-red-700">{error("name")}</span>}
          </label>
          <label className="text-sm font-semibold text-slate-700">Slug
            <input className={inputClass} name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required value={slug} onChange={(event) => { setSlugTouched(true); setSlug(event.target.value); }} />
            <span className="mt-1 block text-xs font-normal text-slate-500">Se genera desde el nombre y podés editarlo.</span>
            {error("slug") && <span className="mt-1 block text-xs text-red-700">{error("slug")}</span>}
          </label>
          <label className="text-sm font-semibold text-slate-700">Velocidad Mbps
            <input className={inputClass} defaultValue={initialValues?.speed_mbps} min="1" name="speed_mbps" required step="1" type="number" />
            {error("speed_mbps") && <span className="mt-1 block text-xs text-red-700">{error("speed_mbps")}</span>}
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Descripción
            <textarea className={`${inputClass} min-h-28 resize-y`} defaultValue={initialValues?.description ?? ""} name="description" />
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold text-slate-950">Precios</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">Precio regular
            <input className={inputClass} defaultValue={initialValues?.regular_price} min="0" name="regular_price" required step="0.01" type="number" />
            {error("regular_price") && <span className="mt-1 block text-xs text-red-700">{error("regular_price")}</span>}
          </label>
          <label className="text-sm font-semibold text-slate-700">Precio promocional
            <input className={inputClass} defaultValue={initialValues?.promotional_price ?? ""} min="0" name="promotional_price" step="0.01" type="number" />
            {error("promotional_price") && <span className="mt-1 block text-xs text-red-700">{error("promotional_price")}</span>}
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold text-slate-950">Promoción</legend>
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="text-sm font-semibold text-slate-700">Etiqueta
            <input className={inputClass} defaultValue={initialValues?.promotion_label ?? ""} name="promotion_label" />
          </label>
          <label className="text-sm font-semibold text-slate-700">Inicio
            <input className={inputClass} defaultValue={initialStart} type="datetime-local" onChange={(event) => setPromotionStart(event.target.value ? new Date(event.target.value).toISOString() : "")} />
            {error("promotion_start") && <span className="mt-1 block text-xs text-red-700">{error("promotion_start")}</span>}
          </label>
          <label className="text-sm font-semibold text-slate-700">Fin
            <input className={inputClass} defaultValue={initialEnd} type="datetime-local" onChange={(event) => setPromotionEnd(event.target.value ? new Date(event.target.value).toISOString() : "")} />
            {error("promotion_end") && <span className="mt-1 block text-xs text-red-700">{error("promotion_end")}</span>}
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
        <legend className="px-2 text-lg font-bold text-slate-950">Características</legend>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div className="grid grid-cols-[1fr_5rem_auto] gap-2" key={`${feature.id ?? "new"}-${index}`}>
              <input aria-label={`Texto de característica ${index + 1}`} className={inputClass.replace("mt-2 ", "")} placeholder="Ej. Wi-Fi incluido" value={feature.text} onChange={(event) => setFeatures((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, text: event.target.value } : item))} />
              <input aria-label={`Orden de característica ${index + 1}`} className={inputClass.replace("mt-2 ", "")} min="0" step="1" type="number" value={feature.display_order} onChange={(event) => setFeatures((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, display_order: Number(event.target.value) } : item))} />
              <button aria-label={`Quitar característica ${index + 1}`} className="rounded-lg px-3 font-bold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" type="button" onClick={() => setFeatures((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Quitar</button>
            </div>
          ))}
          {error("features") && <p className="text-xs text-red-700">{error("features")}</p>}
          <button className="rounded-lg border border-orange-300 px-4 py-2 text-sm font-bold text-orange-800 hover:bg-orange-50" type="button" onClick={() => setFeatures((current) => [...current, { text: "", display_order: current.length }])}>+ Agregar característica</button>
        </div>
      </fieldset>

      <div className="flex flex-wrap justify-end gap-3">
        <Link className="rounded-xl border border-slate-300 px-5 py-2.5 font-bold text-slate-700 hover:bg-slate-100" href="/admin/plans">Cancelar</Link>
        <button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">{pending ? "Guardando…" : "Guardar plan"}</button>
      </div>
    </form>
  );
}
