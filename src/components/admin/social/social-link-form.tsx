"use client";

import Link from "next/link";
import { useActionState } from "react";

import { saveSocialLink } from "@/app/admin/social/actions";
import { SOCIAL_PLATFORMS, type SocialLinkActionState, type SocialLinkFormValues } from "@/types/social-links";

const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200";
const initialState: SocialLinkActionState = {};

export function SocialLinkForm({ id, initialValues }: Readonly<{ id?: string; initialValues?: SocialLinkFormValues }>) {
  const [state, action, pending] = useActionState(saveSocialLink, initialState);
  const error = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={action} className="space-y-6">
      {id && <input name="id" type="hidden" value={id} />}
      {state.message && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{state.message}</p>}
      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold text-slate-950">Datos del perfil oficial</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">Plataforma
            <select className={inputClass} defaultValue={initialValues?.platform ?? ""} name="platform" required>
              <option disabled value="">Seleccioná una plataforma</option>
              {SOCIAL_PLATFORMS.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
            </select>
            {error("platform") && <span className="mt-1 block text-xs text-red-700">{error("platform")}</span>}
          </label>
          <label className="text-sm font-semibold text-slate-700">Orden
            <input className={inputClass} defaultValue={initialValues?.display_order ?? 0} min="0" name="display_order" required step="1" type="number" />
            {error("display_order") && <span className="mt-1 block text-xs text-red-700">{error("display_order")}</span>}
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">URL
            <input className={inputClass} defaultValue={initialValues?.url} name="url" placeholder="https://..." required type="url" />
            <span className="mt-1 block text-xs font-normal text-slate-500">Debe comenzar con http:// o https://.</span>
            {error("url") && <span className="mt-1 block text-xs text-red-700">{error("url")}</span>}
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-700">
            <input className="size-5 accent-orange-600" defaultChecked={initialValues?.active ?? true} name="active" type="checkbox" /> Activa
          </label>
        </div>
      </fieldset>
      <div className="flex flex-wrap justify-end gap-3">
        <Link className="rounded-xl border border-slate-300 px-5 py-2.5 font-bold text-slate-700 hover:bg-slate-100" href="/admin/social">Cancelar</Link>
        <button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">{pending ? "Guardando…" : "Guardar red social"}</button>
      </div>
    </form>
  );
}
