import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceAreaActionsMenu } from "@/components/admin/services/service-area-actions-menu";
import { createClient } from "@/lib/supabase/server";
import type { ServiceArea } from "@/types/services";
const messages: Record<string, string> = { created: "El área se creó correctamente.", updated: "El área se actualizó correctamente.", activated: "El área quedó activa.", deactivated: "El área quedó inactiva.", deleted: "El área se eliminó correctamente." };
export default async function ServiceAreasPage({ searchParams }: Readonly<{ searchParams: Promise<{ success?: string; error?: string }> }>) {
  const query = await searchParams; const supabase = await createClient();
  const { data, error } = await supabase.from("service_areas").select("id, name, slug, short_description, description, icon, public_url, featured, active, display_order").order("display_order").order("name");
  const areas = (data ?? []) as ServiceArea[];
  return <><div className="flex flex-col gap-4 sm:flex-row sm:justify-between"><AdminPageHeader description="Organizá los servicios concretos dentro de áreas públicas." title="Áreas de servicio" /><div className="flex flex-wrap gap-3"><Link className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold" href="/admin/services">Volver a servicios</Link><Link className="rounded-xl bg-orange-600 px-5 py-3 font-bold text-white" href="/admin/services/areas/new">Nueva área</Link></div></div>
    {query.success && messages[query.success] && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800" role="status">{messages[query.success]}</p>}
    {query.error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{query.error === "has-dependencies" ? "No podés eliminar esta área porque tiene servicios o proyectos asociados." : query.error === "permission" ? "No tenés permiso para realizar esa acción." : "No pudimos completar la acción."}</p>}
    {error ? <p className="rounded-2xl border border-red-200 bg-white p-8">No pudimos cargar las áreas.</p> : <div className="grid gap-4 lg:block lg:overflow-visible lg:rounded-2xl lg:border lg:bg-white">
      <div className="hidden grid-cols-[1.2fr_2fr_.7fr_.6fr_1.2fr] gap-4 border-b bg-slate-50 px-5 py-3 text-xs font-bold uppercase text-slate-600 lg:grid"><span>Área</span><span>Descripción corta</span><span>Estado</span><span>Orden</span><span>Acciones</span></div>
      {areas.map((area) => <article className="rounded-2xl border bg-white p-5 shadow-sm lg:grid lg:grid-cols-[1.2fr_2fr_.7fr_.6fr_1.2fr] lg:items-center lg:gap-4 lg:rounded-none lg:border-0 lg:border-b lg:shadow-none last:lg:border-b-0" key={area.id}><div><h2 className="font-bold">{area.name}</h2><p className="text-xs text-slate-500">/{area.slug}</p></div><p className="mt-3 text-sm text-slate-600 lg:mt-0">{area.short_description ?? "—"}</p><span className={`mt-3 w-fit rounded-full px-2.5 py-1 text-xs font-bold lg:mt-0 ${area.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200"}`}>{area.active ? "Activa" : "Inactiva"}</span><p className="mt-3 text-sm lg:mt-0">{area.display_order}</p><div className="mt-4 flex gap-2 lg:mt-0"><Link className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-800" href={`/admin/services/areas/${area.id}/edit`}>Editar</Link><ServiceAreaActionsMenu active={area.active} id={area.id} name={area.name} /></div></article>)}
    </div>}</>;
}
