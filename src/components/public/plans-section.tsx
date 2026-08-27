import { PlanCard } from "@/components/public/plan-card";
import type { Plan } from "@/types/plans";

export function PlansSection({ plans, unavailable }: Readonly<{ plans: Plan[]; unavailable: boolean }>) {
  const now = new Date();
  return (
    <section className="scroll-mt-20 bg-slate-50 py-20 sm:py-28" id="planes" aria-labelledby="plans-title">
      <div className="public-container">
        <div className="max-w-2xl">
          <p className="public-eyebrow">Planes</p>
          <h2 className="public-heading mt-3" id="plans-title">Una conexión para cada necesidad</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Explorá las opciones disponibles y elegí la que mejor acompañe tus actividades.</p>
        </div>
        {unavailable ? (
          <p className="public-empty-state" role="status">Los planes no están disponibles temporalmente.</p>
        ) : plans.length === 0 ? (
          <p className="public-empty-state">Estamos actualizando nuestros planes disponibles.</p>
        ) : (
          <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => <PlanCard key={plan.id} now={now} plan={plan} />)}
          </div>
        )}
      </div>
    </section>
  );
}
