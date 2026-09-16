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
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.18em] text-[#087f5b] uppercase">Planes de Internet</p>
          <h2 className="public-heading mt-3" id="plans-title">Una conexión para cada necesidad</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Elegí la velocidad que acompaña tus actividades.</p>
          {(installationPrice !== null || installationBenefitsText) && (
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              {installationPrice !== null && (
                <>
                  <span className="font-extrabold text-slate-800">Instalación {currency.format(installationPrice)}</span>
                  {installationBenefitsText && <span aria-hidden="true"> — </span>}
                </>
              )}
              {installationBenefitsText}
            </p>
          )}
        </div>
        {unavailable ? (
          <p className="public-empty-state" role="status">Los planes no están disponibles temporalmente.</p>
        ) : plans.length === 0 ? (
          <p className="public-empty-state">Estamos actualizando nuestros planes disponibles.</p>
        ) : (
          <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-6 lg:gap-7">
            {plans.map((plan) => <PlanCard key={plan.id} now={now} plan={plan} />)}
          </div>
        )}
      </div>
    </section>
  );
}
