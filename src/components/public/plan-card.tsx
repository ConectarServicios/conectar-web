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
    <article className={`relative flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8 ${plan.featured ? "border-orange-400 ring-4 ring-orange-100" : "border-slate-200"}`}>
      {plan.featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-orange-500 px-3 py-1 text-xs font-black tracking-wide text-white uppercase shadow-sm">
          Plan destacado
        </span>
      )}
      <div className="border-b border-slate-100 pb-6">
        <p className="text-sm font-bold tracking-wide text-blue-700 uppercase">{plan.name}</p>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-slate-950">
          <div><dt className="text-xs font-bold tracking-wide text-slate-500 uppercase">Bajada</dt><dd className="mt-1 text-2xl font-black tracking-tight"><span aria-hidden="true">↓ </span>{plan.speed_mbps} <span className="text-sm text-slate-500">Mbps</span></dd></div>
          <div><dt className="text-xs font-bold tracking-wide text-slate-500 uppercase">Subida</dt><dd className="mt-1 text-2xl font-black tracking-tight"><span aria-hidden="true">↑ </span>{plan.upload_speed_mbps === null ? <span className="text-base text-slate-500">No informada</span> : <>{plan.upload_speed_mbps} <span className="text-sm text-slate-500">Mbps</span></>}</dd></div>
        </dl>
        {plan.description && <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>}
      </div>
      <div className="py-6">
        {promotionIsCurrent ? (
          <>
            {plan.promotion_label && <p className="mb-2 text-sm font-bold text-orange-700">{plan.promotion_label}</p>}
            <p className="text-sm text-slate-500 line-through">{currency.format(plan.regular_price)}</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">{currency.format(plan.promotional_price!)}</p>
            <p className="mt-1 text-xs text-slate-500">Precio promocional</p>
          </>
        ) : (
          <>
            <p className="text-3xl font-black tracking-tight text-slate-950">{currency.format(plan.regular_price)}</p>
            <p className="mt-1 text-xs text-slate-500">Precio regular</p>
          </>
        )}
      </div>
      {plan.plan_features.length > 0 && (
        <ul className="mt-auto space-y-3 border-t border-slate-100 pt-6" aria-label={`Características de ${plan.name}`}>
          {plan.plan_features.map((feature) => (
            <li className="flex gap-3 text-sm leading-6 text-slate-700" key={feature.id ?? `${feature.display_order}-${feature.text}`}>
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-blue-50 font-bold text-blue-700" aria-hidden="true">✓</span>
              {feature.text}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
