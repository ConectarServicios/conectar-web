"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { saveNews } from "@/app/admin/news/actions";
import { normalizeNewsSlug } from "@/lib/validations/news";
import { NEWS_CATEGORIES, type NewsActionState, type NewsFormValues } from "@/types/news";

const input = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200";
export function NewsForm({ id, initialValues }: Readonly<{ id?: string; initialValues?: NewsFormValues }>) {
  const [state, action, pending] = useActionState(saveNews, {} as NewsActionState);
  const [slug, setSlug] = useState(initialValues?.slug ?? ""); const [manual, setManual] = useState(Boolean(id));
  const error = (key: string) => state.fieldErrors?.[key];
  return <form action={action} className="space-y-6">
    {id && <><input name="id" type="hidden" value={id}/><input name="current_cover_image" type="hidden" value={initialValues?.cover_image ?? ""}/></>}
    {state.message && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{state.message}</p>}
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><legend className="px-2 text-lg font-bold">Contenido editorial</legend><div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-semibold sm:col-span-2">Título<input className={input} defaultValue={initialValues?.title} name="title" onChange={(e) => { if (!manual) setSlug(normalizeNewsSlug(e.target.value)); }} required/>{error("title") && <span className="text-xs text-red-700">{error("title")}</span>}</label>
      <label className="text-sm font-semibold sm:col-span-2">Slug<input className={input} name="slug" onChange={(e) => { setManual(true); setSlug(normalizeNewsSlug(e.target.value)); }} required value={slug}/><span className="mt-1 block text-xs font-normal text-slate-500">URL pública: /noticias/{slug || "slug-de-la-noticia"}</span>{error("slug") && <span className="text-xs text-red-700">{error("slug")}</span>}</label>
      <label className="text-sm font-semibold sm:col-span-2">Resumen (recomendado)<textarea className={`${input} min-h-24`} defaultValue={initialValues?.excerpt ?? ""} name="excerpt"/><span className="mt-1 block text-xs font-normal text-slate-500">Se utiliza en las cards y listados públicos.</span></label>
      <label className="text-sm font-semibold sm:col-span-2">Contenido<textarea className={`${input} min-h-72 resize-y`} defaultValue={initialValues?.content} name="content" required/>{error("content") && <span className="text-xs text-red-700">{error("content")}</span>}<span className="mt-1 block text-xs font-normal text-slate-500">Texto plano; los saltos de línea se conservarán.</span></label>
    </div></fieldset>
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><legend className="px-2 text-lg font-bold">Imagen de portada</legend>{initialValues?.cover_image && <p className="mb-2 text-sm text-slate-600">Elegí un archivo solo para reemplazar la imagen actual.</p>}<label className="text-sm font-semibold">JPG, PNG o WebP (máximo 5 MB)<input accept="image/jpeg,image/png,image/webp" className={input} name="cover_image" type="file"/>{error("cover_image") && <span className="text-xs text-red-700">{error("cover_image")}</span>}</label></fieldset>
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><legend className="px-2 text-lg font-bold">Publicación</legend><div className="grid gap-5 sm:grid-cols-3">
      <label className="text-sm font-semibold">Categoría<select className={input} defaultValue={initialValues?.category ?? NEWS_CATEGORIES[0]} name="category">{NEWS_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>{error("category") && <span className="text-xs text-red-700">{error("category")}</span>}</label>
      <label className="text-sm font-semibold">Estado<select className={input} defaultValue={initialValues?.status ?? "draft"} name="status"><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
      <label className="text-sm font-semibold">Fecha de publicación<input className={input} defaultValue={initialValues?.published_at ? initialValues.published_at.slice(0,16) : ""} name="published_at" type="datetime-local"/>{error("published_at") && <span className="text-xs text-red-700">{error("published_at")}</span>}</label>
      <label className="flex items-center gap-3 text-sm font-semibold"><input className="size-5 accent-orange-600" defaultChecked={initialValues?.featured} name="featured" type="checkbox"/> Destacada</label>
    </div></fieldset>
    <div className="flex justify-end gap-3"><Link className="rounded-xl border border-slate-300 px-5 py-2.5 font-bold" href="/admin/news">Cancelar</Link><button className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white disabled:opacity-60" disabled={pending}>{pending ? "Guardando…" : "Guardar noticia"}</button></div>
  </form>;
}
