import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceActionsMenu } from "@/components/admin/services/service-actions-menu";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/types/services";

const feedback: Record<string, string> = {
  created: "El servicio se creó correctamente.", updated: "El servicio se actualizó correctamente.",
  activated: "El servicio quedó activo.", deactivated: "El servicio quedó inactivo.", deleted: "El servicio se eliminó correctamente.",
};

export default async function ServicesPage({ searchParams }: Readonly<{ searchParams: Promise<{ success?: string; error?: string }> }>) {
  const query = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("services")
    .select("id, name, slug, short_description, description, image_url, icon, category, service_area_id, featured, active, display_order, service_areas(id, name)")
    .order("display_order", { ascending: true }).order("name", { ascending: true });
  if (error) console.error("Unable to list services", error);
  const services = (data ?? []) as Service[];

  return <>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <AdminPageHeader description="Gestioná los servicios disponibles de Conectar Servicios." title="Servicios" />
      <div className="flex flex-wrap gap-3"><Link className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-bold text-slate-700 hover:bg-slate-50" href="/admin/services/areas">Administrar áreas</Link><Link className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-3 text-center font-bold text-orange-800 hover:bg-orange-100" href="/admin/services/projects">Proyectos / soluciones</Link><Link className="rounded-xl bg-orange-600 px-5 py-3 text-center font-bold text-white shadow-sm hover:bg-orange-700" href="/admin/services/new">Nuevo servicio</Link></div>
    </div>
    {query.success && feedback[query.success] && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{feedback[query.success]}</p>}
    {query.error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{query.error === "permission" ? "No tenés permiso para realizar esa acción." : "No pudimos completar la acción. Intentá nuevamente."}</p>}
    {error ? <div className="rounded-2xl border border-red-200 bg-white p-8 text-center"><h2 className="font-bold text-slate-950">No pudimos cargar los servicios</h2><p className="mt-2 text-slate-600">Intentá nuevamente en unos minutos.</p></div>
      : services.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-xl font-bold text-slate-950">Todavía no hay servicios cargados.</h2><p className="mt-2 text-slate-600">Creá el primer servicio para comenzar.</p><Link className="mt-6 inline-block rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700" href="/admin/services/new">Crear primer servicio</Link></div>
      : <div className="grid gap-4 lg:block lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:shadow-sm">
        <div className="hidden grid-cols-[1.1fr_.8fr_1.5fr_.65fr_.65fr_.45fr_1.2fr] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold tracking-wide text-slate-600 uppercase lg:grid"><span>Servicio</span><span>Área</span><span>Descripción corta</span><span>Estado</span><span>Destacado</span><span>Orden</span><span>Acciones</span></div>
        {services.map((service) => <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid lg:grid-cols-[1.1fr_.8fr_1.5fr_.65fr_.65fr_.45fr_1.2fr] lg:items-center lg:gap-3 lg:rounded-none lg:border-0 lg:border-b lg:p-5 lg:shadow-none last:lg:border-b-0" key={service.id}>
          <h2 className="font-bold text-slate-950">{service.name}</h2>
          <p className="mt-3 text-sm text-slate-700 lg:mt-0"><span className="font-semibold lg:hidden">Área: </span>{(Array.isArray(service.service_areas) ? service.service_areas[0]?.name : service.service_areas?.name) ?? "Sin área"}</p>
          <p className="mt-2 text-sm text-slate-700 lg:mt-0"><span className="font-semibold lg:hidden">Descripción: </span>{service.short_description ?? "—"}</p>
          <span className={`mt-3 w-fit rounded-full px-2.5 py-1 text-xs font-bold lg:mt-0 ${service.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{service.active ? "Activo" : "Inactivo"}</span>
          <p className="mt-3 text-sm text-slate-700 lg:mt-0"><span className="font-semibold lg:hidden">Destacado: </span>{service.featured ? "Sí" : "No"}</p>
          <p className="mt-2 text-sm text-slate-700 lg:mt-0"><span className="font-semibold lg:hidden">Orden: </span>{service.display_order}</p>
          <div className="mt-5 flex items-center gap-2 text-sm lg:mt-0"><Link className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 font-bold text-orange-800 hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-orange-500" href={`/admin/services/${service.id}/edit`}>Editar</Link><ServiceActionsMenu active={service.active} id={service.id} name={service.name} /></div>
        </article>)}
      </div>}
  </>;
}
