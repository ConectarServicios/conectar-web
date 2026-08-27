import { PlanCard } from "@/components/public/plan-card";
import type { Plan } from "@/types/plans";

const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

type PlansSectionProps = Readonly<{
  installationBenefitsText: string | null;
  installationPrice: number | null;
  plans: Plan[];
  unavailable: boolean;
}>;

export function PlansSection({ installationBenefitsText, installationPrice, plans, unavailable }: PlansSectionProps) {
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
        {installationPrice !== null && (
          <div className="mt-10 rounded-2xl border border-blue-100 bg-white px-6 py-5 shadow-sm sm:max-w-xl">
            <p className="font-bold text-slate-700">Instalación</p>
            <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">{currency.format(installationPrice)}</p>
            <p className="mt-1 text-sm text-slate-500">Precio de lista.</p>
            {installationBenefitsText && <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-700">{installationBenefitsText}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
