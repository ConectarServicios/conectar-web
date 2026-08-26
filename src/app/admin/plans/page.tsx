import Link from "next/link";

import { togglePlanActive } from "@/app/admin/plans/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PlanDeleteButton } from "@/components/admin/plans/plan-delete-button";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types/plans";

const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const feedback: Record<string, string> = {
  created: "El plan se creó correctamente.", updated: "El plan se actualizó correctamente.",
  activated: "El plan quedó activo.", deactivated: "El plan quedó inactivo.", deleted: "El plan se eliminó correctamente.",
};

export default async function PlansPage({ searchParams }: Readonly<{ searchParams: Promise<{ success?: string; error?: string }> }>) {
  const query = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plans")
    .select("id, name, slug, speed_mbps, description, regular_price, promotional_price, promotion_label, promotion_start, promotion_end, featured, active, display_order, plan_features(id, text, display_order)")
    .order("display_order", { ascending: true }).order("speed_mbps", { ascending: true }).order("name", { ascending: true });
  if (error) console.error("Unable to list plans", error);
  const plans = (data ?? []) as Plan[];

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader description="Gestioná los planes de internet, precios, velocidades y promociones." title="Planes" />
        <Link className="shrink-0 rounded-xl bg-orange-600 px-5 py-3 text-center font-bold text-white shadow-sm hover:bg-orange-700" href="/admin/plans/new">Nuevo plan</Link>
      </div>
      {query.success && feedback[query.success] && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{feedback[query.success]}</p>}
      {query.error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{query.error === "permission" ? "No tenés permiso para realizar esa acción." : "No pudimos completar la acción. Intentá nuevamente."}</p>}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center"><h2 className="font-bold text-slate-950">No pudimos cargar los planes</h2><p className="mt-2 text-slate-600">Intentá nuevamente en unos minutos.</p></div>
      ) : plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-bold text-slate-950">Todavía no hay planes cargados.</h2><p className="mt-2 text-slate-600">Creá el primer plan para comenzar.</p>
          <Link className="mt-6 inline-block rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700" href="/admin/plans/new">Crear primer plan</Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:block lg:overflow-hidden lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:shadow-sm">
          <div className="hidden grid-cols-[1.5fr_.7fr_1fr_.8fr_.6fr_.7fr_1.2fr] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold tracking-wide text-slate-600 uppercase lg:grid">
            <span>Plan</span><span>Velocidad</span><span>Precio</span><span>Estado</span><span>Orden</span><span>Características</span><span>Acciones</span>
          </div>
          {plans.map((plan) => (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid lg:grid-cols-[1.5fr_.7fr_1fr_.8fr_.6fr_.7fr_1.2fr] lg:items-center lg:gap-3 lg:rounded-none lg:border-0 lg:border-b lg:p-5 lg:shadow-none last:lg:border-b-0" key={plan.id}>
              <div><h2 className="font-bold text-slate-950">{plan.name}</h2>{plan.featured && <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">Destacado</span>}</div>
              <p className="mt-3 text-sm text-slate-700 lg:mt-0"><span className="font-semibold lg:hidden">Velocidad: </span>{plan.speed_mbps} Mbps</p>
              <div className="mt-2 text-sm lg:mt-0"><p className="text-slate-700">{currency.format(plan.regular_price)}</p>{plan.promotional_price !== null && <p className="font-bold text-orange-700">{currency.format(plan.promotional_price)}</p>}</div>
              <span className={`mt-3 w-fit rounded-full px-2.5 py-1 text-xs font-bold lg:mt-0 ${plan.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{plan.active ? "Activo" : "Inactivo"}</span>
              <p className="mt-3 text-sm text-slate-700 lg:mt-0"><span className="font-semibold lg:hidden">Orden: </span>{plan.display_order}</p>
              <p className="mt-2 text-sm text-slate-700 lg:mt-0"><span className="font-semibold lg:hidden">Características: </span>{plan.plan_features.length}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm lg:mt-0">
                <Link className="font-bold text-orange-700 hover:text-orange-900" href={`/admin/plans/${plan.id}/edit`}>Editar</Link>
                <form action={togglePlanActive}><input name="id" type="hidden" value={plan.id} /><input name="active" type="hidden" value={String(!plan.active)} /><button className="font-bold text-slate-700 hover:text-slate-950" type="submit">{plan.active ? "Desactivar" : "Activar"}</button></form>
                <PlanDeleteButton id={plan.id} name={plan.name} />
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
