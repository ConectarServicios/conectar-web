import { Check } from "lucide-react";
import type { Plan } from "@/types/plans";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

function hasCurrentPromotion(plan: Plan, now: Date) {
  if (plan.promotional_price === null) return false;

  const startsAt = plan.promotion_start ? new Date(plan.promotion_start) : null;
  const endsAt = plan.promotion_end ? new Date(plan.promotion_end) : null;

  return (!startsAt || startsAt <= now) && (!endsAt || now <= endsAt);
}

export function PlanCard({ plan, now }: Readonly<{ plan: Plan; now: Date }>) {
  const promotionIsCurrent = hasCurrentPromotion(plan, now);

  return (
    <article className={`relative flex h-full min-w-0 flex-col rounded-3xl border bg-white p-6 transition motion-reduce:transform-none sm:p-7 ${plan.featured ? "border-[#12b886] shadow-[0_18px_45px_-28px_rgba(8,127,91,0.75)] ring-1 ring-[#12b886]/25 hover:-translate-y-1 hover:shadow-[0_22px_55px_-28px_rgba(8,127,91,0.8)]" : "border-slate-200 shadow-sm hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"}`}>
      <span className={`absolute inset-x-6 top-0 h-1 rounded-b-full ${plan.featured ? "bg-[#12b886]" : "bg-slate-200"}`} aria-hidden="true" />
      {plan.featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-[#087f5b] px-3 py-1 text-xs font-black tracking-wide text-white uppercase shadow-sm">
          Más elegido
        </span>
      )}
      <div className="border-b border-slate-100 pb-5">
        <p className="text-sm font-extrabold tracking-wide text-[#087f5b] uppercase">{plan.name}</p>
        <p className="mt-4 font-display text-4xl leading-none font-black tracking-[-0.04em] text-[#071a2f] sm:text-5xl">
          {plan.speed_mbps} <span className="text-xl tracking-tight text-slate-500 sm:text-2xl">MB</span>
        </p>
        <dl className="mt-5 space-y-2 text-sm font-semibold text-slate-700">
          <div className="flex items-baseline justify-between gap-3"><dt><span className="mr-2 text-[#087f5b]" aria-hidden="true">↓</span>Bajada</dt><dd className="font-extrabold text-[#071a2f]">{plan.speed_mbps} Mbps</dd></div>
          <div className="flex items-baseline justify-between gap-3"><dt><span className="mr-2 text-[#087f5b]" aria-hidden="true">↑</span>Subida</dt><dd className="text-right font-extrabold text-[#071a2f]">{plan.upload_speed_mbps === null ? <span className="font-semibold text-slate-500">No informada</span> : <>{plan.upload_speed_mbps} Mbps</>}</dd></div>
        </dl>
        {plan.description && <p className="mt-4 text-sm leading-6 text-slate-600">{plan.description}</p>}
      </div>
      <div className="min-h-32 py-5">
        {promotionIsCurrent ? (
          <>
            {plan.promotion_label && <p className="mb-1 text-sm font-extrabold text-[#087f5b]">{plan.promotion_label}</p>}
            <p className="text-sm text-slate-500 line-through"><span className="sr-only">Precio regular: </span>{currency.format(plan.regular_price)}</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-[#071a2f] sm:text-4xl">{currency.format(plan.promotional_price!)}</p>
            <p className="mt-1 text-sm text-slate-500">por mes · precio promocional</p>
          </>
        ) : (
          <>
            <p className="text-3xl font-black tracking-tight text-[#071a2f] sm:text-4xl">{currency.format(plan.regular_price)}</p>
            <p className="mt-1 text-sm text-slate-500">por mes</p>
          </>
        )}
      </div>
      <div className="mt-auto">
        {plan.plan_features.length > 0 && (
          <ul className="space-y-2.5 border-t border-slate-100 pt-5" aria-label={`Características de ${plan.name}`}>
            {plan.plan_features.map((feature) => (
              <li className="flex gap-2.5 text-sm leading-5 text-slate-700" key={feature.id ?? `${feature.display_order}-${feature.text}`}>
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#12b886]/12 text-[#087f5b]" aria-hidden="true">
                  <Check size={13} strokeWidth={3.5} />
                </span>
                {feature.text}
              </li>
            ))}
          </ul>
        )}
        <a
          className={`mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl px-5 py-3 text-center font-extrabold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087f5b] ${plan.featured ? "bg-[#12b886] text-[#03221b] hover:bg-[#18c996]" : "border border-[#087f5b] text-[#087f5b] hover:bg-[#087f5b] hover:text-white"}`}
          href="#contacto"
        >
          Consultar plan
        </a>
      </div>
    </article>
  );
}
