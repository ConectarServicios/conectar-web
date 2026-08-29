import Link from "next/link";

import { featureHeroSlide, toggleHeroSlide } from "@/app/admin/hero/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HeroDeleteButton } from "@/components/admin/hero/hero-delete-button";
import { createClient } from "@/lib/supabase/server";
import type { HeroSlide } from "@/types/hero";

const feedback: Record<string, string> = { created: "El slide se creó correctamente.", updated: "El slide se actualizó correctamente.", activated: "El slide quedó activo.", deactivated: "El slide quedó inactivo.", featured: "El slide quedó marcado como principal.", deleted: "El slide y su imagen se eliminaron correctamente." };

export default async function HeroAdminPage({ searchParams }: Readonly<{ searchParams: Promise<{ success?: string; error?: string }> }>) {
  const query = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("hero_slides").select("id, title, subtitle, image_path, button_text, button_url, active, featured, display_order").order("featured", { ascending: false }).order("display_order", { ascending: true }).order("created_at", { ascending: true });
  if (error) console.error("Unable to list hero slides", error);
  const slides = (data ?? []) as HeroSlide[];
  return <>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><AdminPageHeader description="Gestioná las imágenes y mensajes del carrusel principal de la Home." title="Hero / Banners" /><Link className="shrink-0 rounded-xl bg-orange-600 px-5 py-3 text-center font-bold text-white hover:bg-orange-700" href="/admin/hero/new">Nuevo slide</Link></div>
    {query.success && feedback[query.success] && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{feedback[query.success]}</p>}
    {query.error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{query.error === "active-limit" ? "Ya hay 3 slides activos. Desactivá uno antes de activar otro." : query.error === "permission" ? "No tenés permiso para realizar esa acción." : query.error === "image-cleanup" ? "El contenido se guardó, pero no pudimos borrar la imagen anterior. Intentá eliminarla nuevamente desde Storage." : "No pudimos completar la acción. Intentá nuevamente."}</p>}
    {error ? <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">No pudimos cargar los slides.</div> : slides.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-xl font-bold text-slate-950">Todavía no hay slides.</h2><p className="mt-2 text-slate-600">La Home seguirá mostrando el Hero de respaldo.</p><Link className="mt-6 inline-block rounded-xl bg-orange-600 px-5 py-3 font-bold text-white" href="/admin/hero/new">Crear primer slide</Link></div> :
      <div className="grid gap-4 lg:block lg:overflow-hidden lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white">
        <div className="hidden grid-cols-[1.7fr_.7fr_.6fr_.8fr_1.6fr] gap-3 border-b bg-slate-50 px-5 py-3 text-xs font-bold uppercase text-slate-600 lg:grid"><span>Slide</span><span>Estado</span><span>Orden</span><span>Principal</span><span>Acciones</span></div>
        {slides.map((slide) => <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid lg:grid-cols-[1.7fr_.7fr_.6fr_.8fr_1.6fr] lg:items-center lg:gap-3 lg:rounded-none lg:border-0 lg:border-b lg:shadow-none last:lg:border-b-0" key={slide.id}>
          <div><h2 className="font-bold text-slate-950">{slide.title}</h2><p className="mt-1 line-clamp-1 text-sm text-slate-600">{slide.subtitle || "Sin subtítulo"}</p></div>
          <span className={`mt-3 w-fit rounded-full px-2.5 py-1 text-xs font-bold lg:mt-0 ${slide.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{slide.active ? "Activo" : "Inactivo"}</span>
          <p className="mt-3 text-sm lg:mt-0"><span className="font-semibold lg:hidden">Orden: </span>{slide.display_order}</p><p className="mt-2 text-sm lg:mt-0">{slide.featured ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">Principal</span> : "—"}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm lg:mt-0"><Link className="font-bold text-orange-700" href={`/admin/hero/${slide.id}/edit`}>Editar</Link><form action={toggleHeroSlide}><input name="id" type="hidden" value={slide.id} /><input name="active" type="hidden" value={String(!slide.active)} /><button className="font-bold text-slate-700" type="submit">{slide.active ? "Desactivar" : "Activar"}</button></form>{!slide.featured && <form action={featureHeroSlide}><input name="id" type="hidden" value={slide.id} /><button className="font-bold text-slate-700" type="submit">Hacer principal</button></form>}<HeroDeleteButton id={slide.id} title={slide.title} /></div>
        </article>)}
      </div>}
  </>;
}
