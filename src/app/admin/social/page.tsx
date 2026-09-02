import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SocialActionsMenu } from "@/components/admin/social/social-actions-menu";
import { createClient } from "@/lib/supabase/server";
import type { SocialLink } from "@/types/social-links";

const feedback: Record<string, string> = {
  created: "La red social se creó correctamente.", updated: "La red social se actualizó correctamente.",
  activated: "La red social quedó activa.", deactivated: "La red social quedó inactiva.", deleted: "La red social se eliminó correctamente.",
};

export default async function SocialPage({ searchParams }: Readonly<{ searchParams: Promise<{ success?: string; error?: string }> }>) {
  const query = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("social_links").select("id, platform, url, active, display_order")
    .order("display_order", { ascending: true }).order("platform", { ascending: true });
  if (error) console.error("Unable to list social links", error);
  const socialLinks = (data ?? []) as SocialLink[];

  return <>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <AdminPageHeader description="Gestioná los enlaces a los perfiles sociales oficiales." title="Redes sociales" />
      <Link className="shrink-0 rounded-xl bg-orange-600 px-5 py-3 text-center font-bold text-white shadow-sm hover:bg-orange-700" href="/admin/social/new">Nueva red social</Link>
    </div>
    {query.success && feedback[query.success] && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{feedback[query.success]}</p>}
    {query.error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{query.error === "permission" ? "No tenés permiso para realizar esa acción." : "No pudimos completar la acción. Intentá nuevamente."}</p>}
    {error ? <div className="rounded-2xl border border-red-200 bg-white p-8 text-center"><h2 className="font-bold text-slate-950">No pudimos cargar las redes sociales</h2><p className="mt-2 text-slate-600">Intentá nuevamente en unos minutos.</p></div>
      : socialLinks.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-xl font-bold text-slate-950">Todavía no hay redes sociales cargadas.</h2><p className="mt-2 text-slate-600">Creá el primer enlace oficial para comenzar.</p></div>
      : <div className="grid gap-4 lg:block lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:shadow-sm">
        <div className="hidden grid-cols-[1fr_2fr_.7fr_.5fr_1.3fr] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold tracking-wide text-slate-600 uppercase lg:grid"><span>Plataforma</span><span>URL</span><span>Estado</span><span>Orden</span><span>Acciones</span></div>
        {socialLinks.map((socialLink) => <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid lg:grid-cols-[1fr_2fr_.7fr_.5fr_1.3fr] lg:items-center lg:gap-3 lg:rounded-none lg:border-0 lg:border-b lg:p-5 lg:shadow-none last:lg:border-b-0" key={socialLink.id}>
          <h2 className="font-bold text-slate-950">{socialLink.platform}</h2>
          <a className="mt-2 truncate text-sm text-blue-700 underline lg:mt-0" href={socialLink.url} rel="noopener noreferrer" target="_blank">{socialLink.url}</a>
          <span className={`mt-3 w-fit rounded-full px-2.5 py-1 text-xs font-bold lg:mt-0 ${socialLink.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{socialLink.active ? "Activa" : "Inactiva"}</span>
          <p className="mt-2 text-sm text-slate-700 lg:mt-0"><span className="font-semibold lg:hidden">Orden: </span>{socialLink.display_order}</p>
          <div className="mt-5 flex items-center gap-2 text-sm lg:mt-0"><Link className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 font-bold text-orange-800 hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-orange-500" href={`/admin/social/${socialLink.id}/edit`}>Editar</Link><SocialActionsMenu active={socialLink.active} id={socialLink.id} platform={socialLink.platform} /></div>
        </article>)}
      </div>}
  </>;
}
