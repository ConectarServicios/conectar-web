import { PlansCarousel } from "@/components/public/plans-carousel";
import type { Plan } from "@/types/plans";

const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

type PlansSectionProps = Readonly<{
  installationBenefitsText: string | null;
  installationPrice: number | null;
  installationInstallmentCount: number | null;
  installationInstallmentPrice: number | null;
  plans: Plan[];
  unavailable: boolean;
  whatsapp: string | null;
}>;

export function PlansSection({ installationBenefitsText, installationInstallmentCount, installationInstallmentPrice, installationPrice, plans, unavailable, whatsapp }: PlansSectionProps) {
  const now = new Date();
  const hasInstallments =
    installationInstallmentCount !== null &&
    Number.isInteger(installationInstallmentCount) &&
    installationInstallmentCount > 0 &&
    installationInstallmentPrice !== null &&
    Number.isFinite(installationInstallmentPrice) &&
    installationInstallmentPrice >= 0;
  return (
    <section className="scroll-mt-20 bg-home-surface-soft py-20 sm:py-28" id="planes" aria-labelledby="plans-title">
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.18em] text-home-accent-strong uppercase">Planes de Internet</p>
          <h2 className="public-heading mt-3" id="plans-title">Una conexión para cada necesidad</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Elegí la velocidad que acompaña tus actividades.</p>
          {(installationPrice !== null || installationBenefitsText) && (
            <div className="mt-5 text-sm leading-6 text-slate-600 sm:text-base">
              {installationPrice !== null && (
                <div className="max-w-xl rounded-2xl border border-orange-200 bg-white p-4 sm:p-5">
                  <p className="text-xs font-black tracking-[0.18em] text-home-accent-strong uppercase">Instalación</p>
                  <p className="mt-1 text-3xl font-black tracking-tight text-brand-navy-deep sm:text-4xl">
                    {currency.format(installationPrice)}
                  </p>
                  {hasInstallments && (
                    <p className="mt-3 inline-flex rounded-full bg-home-surface-soft px-3 py-1.5 text-sm font-bold text-slate-700 sm:text-base">
                      También disponible en {installationInstallmentCount} cuotas de {currency.format(installationInstallmentPrice)}
                    </p>
                  )}
                </div>
              )}
              {installationBenefitsText && <p className="mt-3 max-w-xl">{installationBenefitsText}</p>}
            </div>
          )}
          {installationPrice === null && (
            <p className="mt-3 text-sm font-extrabold text-slate-700">Consultá el costo de instalación.</p>
          )}
        </div>
        {unavailable ? (
          <p className="public-empty-state" role="status">Los planes no están disponibles temporalmente.</p>
        ) : plans.length === 0 ? (
          <p className="public-empty-state">Estamos actualizando nuestros planes disponibles.</p>
        ) : (
          <PlansCarousel now={now.toISOString()} plans={plans} whatsapp={whatsapp} />
        )}
      </div>
    </section>
  );
}
