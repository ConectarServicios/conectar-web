import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NewsActionsMenu } from "@/components/admin/news/news-actions-menu";
import { createClient } from "@/lib/supabase/server";
import type { NewsItem } from "@/types/news";
import { argentinaAdminDateTimeFormatter } from "@/lib/utils/news-dates";

const success: Record<string,string> = { created:"La noticia se creó correctamente.",updated:"La noticia se actualizó correctamente.",deleted:"La noticia se eliminó correctamente.",published:"La noticia quedó publicada.",draft:"La noticia volvió a borrador.",archived:"La noticia quedó archivada.",featured:"La noticia quedó destacada.",unfeatured:"La noticia dejó de estar destacada." };
const labels = { draft:"Borrador", published:"Publicado", archived:"Archivado" };
const date = (value: string | null) => value ? argentinaAdminDateTimeFormatter.format(new Date(value)) : "—";
export default async function NewsAdminPage({ searchParams }: Readonly<{ searchParams: Promise<{ success?: string; error?: string }> }>) {
  const params = await searchParams; const supabase = await createClient();
  const { data, error } = await supabase.from("news").select("id,title,slug,excerpt,content,cover_image,category,status,featured,published_at,author_id,created_at,author:profiles(full_name)").order("featured",{ascending:false}).order("published_at",{ascending:false,nullsFirst:false}).order("created_at",{ascending:false});
  if (error) console.error("Unable to list news", error); const news = (data ?? []) as unknown as NewsItem[];
  return <>
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between"><AdminPageHeader description="Creá, programá y administrá las novedades institucionales." title="Noticias / Comunicados"/><Link className="shrink-0 self-start rounded-xl bg-orange-600 px-5 py-3 text-center font-bold text-white" href="/admin/news/new">Nueva noticia</Link></div>
    {params.success && success[params.success] && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{success[params.success]}</p>}
    {params.error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{params.error === "image-cleanup" ? "La noticia se guardó, pero no pudimos limpiar la imagen anterior." : "No pudimos completar la acción o no tenés permiso."}</p>}
    {error ? <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">No pudimos cargar las noticias.</div> : news.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-xl font-bold">Todavía no hay noticias.</h2><Link className="mt-5 inline-block rounded-xl bg-orange-600 px-5 py-3 font-bold text-white" href="/admin/news/new">Crear la primera</Link></div> :
    <div className="grid gap-4 xl:block xl:rounded-2xl xl:border xl:bg-white"><div className="hidden grid-cols-[1.4fr_.7fr_.6fr_.8fr_.5fr_.8fr_1.7fr] gap-3 bg-slate-50 px-5 py-3 text-xs font-bold uppercase text-slate-600 xl:grid"><span>Título</span><span>Categoría</span><span>Estado</span><span>Publicación</span><span>Destacada</span><span>Autor</span><span>Acciones</span></div>{news.map((item) => <article className="rounded-2xl border bg-white p-5 shadow-sm xl:grid xl:grid-cols-[1.4fr_.7fr_.6fr_.8fr_.5fr_.8fr_1.7fr] xl:items-center xl:gap-3 xl:rounded-none xl:border-0 xl:border-b xl:shadow-none" key={item.id}>
      <h2 className="font-bold">{item.title}</h2><p className="mt-2 text-sm xl:mt-0"><span className="font-semibold xl:hidden">Categoría: </span>{item.category ?? "—"}</p><p className="mt-2 text-sm xl:mt-0"><span className="font-semibold xl:hidden">Estado: </span><span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold">{labels[item.status]}</span></p><p className="mt-2 text-sm xl:mt-0"><span className="font-semibold xl:hidden">Publicación: </span>{date(item.published_at)}</p><p className="mt-2 text-sm xl:mt-0"><span className="font-semibold xl:hidden">Destacada: </span>{item.featured ? "Sí" : "No"}</p><p className="mt-2 text-sm xl:mt-0"><span className="font-semibold xl:hidden">Autor: </span>{item.author?.full_name ?? "—"}</p>
      <div className="mt-4 flex items-center gap-2 text-sm xl:mt-0"><Link className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 font-bold text-orange-800 hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-orange-500" href={`/admin/news/${item.id}/edit`}>Editar</Link><NewsActionsMenu featured={item.featured} id={item.id} status={item.status} title={item.title} /></div>
    </article>)}</div>}
  </>;
}
