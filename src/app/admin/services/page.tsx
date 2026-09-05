import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceActionsMenu } from "@/components/admin/services/service-actions-menu";
import { createClient } from "@/lib/supabase/server";
import type { Service, ServiceArea } from "@/types/services";

type AdminService = Omit<Service, "service_areas"> & {
  service_areas?: Pick<ServiceArea, "id" | "name" | "display_order"> | Pick<ServiceArea, "id" | "name" | "display_order">[] | null;
};

const feedback: Record<string, string> = {
  created: "El servicio se creó correctamente.", updated: "El servicio se actualizó correctamente.",
  activated: "El servicio quedó activo.", deactivated: "El servicio quedó inactivo.", deleted: "El servicio se eliminó correctamente.",
};

export default async function ServicesPage({ searchParams }: Readonly<{ searchParams: Promise<{ success?: string; error?: string }> }>) {
  const query = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("services")
    .select("id, name, slug, short_description, description, image_url, icon, category, service_area_id, featured, active, display_order, service_areas(id, name, display_order)");
  if (error) console.error("Unable to list services", error);
  const serviceArea = (service: AdminService) => Array.isArray(service.service_areas) ? service.service_areas[0] : service.service_areas;
  const services = ((data ?? []) as AdminService[]).sort((left, right) => {
    const leftAreaOrder = serviceArea(left)?.display_order ?? Number.POSITIVE_INFINITY;
    const rightAreaOrder = serviceArea(right)?.display_order ?? Number.POSITIVE_INFINITY;
    return leftAreaOrder - rightAreaOrder
      || left.display_order - right.display_order
      || left.name.localeCompare(right.name, "es", { sensitivity: "base" });
  });

  return <div className="@container">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <AdminPageHeader description="Gestioná los servicios disponibles de Conectar Servicios." title="Servicios" />
      <div className="flex flex-wrap gap-3"><Link className="whitespace-nowrap rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-bold text-slate-700 hover:bg-slate-50" href="/admin/services/areas">Administrar áreas</Link><Link className="whitespace-nowrap rounded-xl border border-orange-200 bg-orange-50 px-5 py-3 text-center font-bold text-orange-800 hover:bg-orange-100" href="/admin/services/projects">Proyectos / soluciones</Link><Link className="whitespace-nowrap rounded-xl bg-orange-600 px-5 py-3 text-center font-bold text-white shadow-sm hover:bg-orange-700" href="/admin/services/new">Nuevo servicio</Link></div>
    </div>
    {query.success && feedback[query.success] && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{feedback[query.success]}</p>}
    {query.error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{query.error === "permission" ? "No tenés permiso para realizar esa acción." : "No pudimos completar la acción. Intentá nuevamente."}</p>}
    {error ? <div className="rounded-2xl border border-red-200 bg-white p-8 text-center"><h2 className="font-bold text-slate-950">No pudimos cargar los servicios</h2><p className="mt-2 text-slate-600">Intentá nuevamente en unos minutos.</p></div>
      : services.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-xl font-bold text-slate-950">Todavía no hay servicios cargados.</h2><p className="mt-2 text-slate-600">Creá el primer servicio para comenzar.</p><Link className="mt-6 inline-block rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700" href="/admin/services/new">Crear primer servicio</Link></div>
      : <div className="grid gap-4 @[1120px]:block @[1120px]:rounded-2xl @[1120px]:border @[1120px]:border-slate-200 @[1120px]:bg-white @[1120px]:shadow-sm">
        <div className="hidden grid-cols-[1.25fr_.75fr_1.6fr_.55fr_.55fr_.4fr_1.25fr] gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold tracking-wide text-slate-600 uppercase @[1120px]:grid"><span>Servicio</span><span>Área</span><span>Descripción corta</span><span>Estado</span><span>Destacado</span><span>Orden</span><span>Acciones</span></div>
        {services.map((service) => <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm @[1120px]:grid @[1120px]:grid-cols-[1.25fr_.75fr_1.6fr_.55fr_.55fr_.4fr_1.25fr] @[1120px]:items-center @[1120px]:gap-2 @[1120px]:rounded-none @[1120px]:border-0 @[1120px]:border-b @[1120px]:p-4 @[1120px]:shadow-none last:@[1120px]:border-b-0" key={service.id}>
          <h2 className="font-bold text-slate-950">{service.name}</h2>
          <p className="mt-3 text-sm text-slate-700 @[1120px]:mt-0"><span className="font-semibold @[1120px]:hidden">Área: </span>{serviceArea(service)?.name ?? "Sin área"}</p>
          <p className="mt-2 text-sm text-slate-700 @[1120px]:mt-0"><span className="font-semibold @[1120px]:hidden">Descripción: </span>{service.short_description ?? "—"}</p>
          <span className={`mt-3 w-fit rounded-full px-2.5 py-1 text-xs font-bold @[1120px]:mt-0 ${service.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{service.active ? "Activo" : "Inactivo"}</span>
          <p className="mt-3 text-sm text-slate-700 @[1120px]:mt-0"><span className="font-semibold @[1120px]:hidden">Destacado: </span>{service.featured ? "Sí" : "No"}</p>
          <p className="mt-2 text-sm text-slate-700 @[1120px]:mt-0"><span className="font-semibold @[1120px]:hidden">Orden: </span>{service.display_order}</p>
          <div className="mt-5 flex items-center gap-2 text-sm @[1120px]:mt-0"><Link className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 font-bold text-orange-800 hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-orange-500" href={`/admin/services/${service.id}/edit`}>Editar</Link><ServiceActionsMenu active={service.active} id={service.id} name={service.name} /></div>
        </article>)}
      </div>}
  </div>;
}
