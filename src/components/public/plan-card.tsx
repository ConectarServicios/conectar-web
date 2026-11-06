import { Check } from "lucide-react";
import { isAllowedContactNumber } from "@/lib/validations/contact-information";
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

export function PlanCard({ plan, now, whatsapp }: Readonly<{ plan: Plan; now: Date; whatsapp: string | null }>) {
  const promotionIsCurrent = hasCurrentPromotion(plan, now);
  const whatsappDigits = whatsapp?.replace(/\D/g, "") ?? "";
  const whatsappMessage = `Hola, quiero consultar por el plan de ${plan.speed_mbps} MB.`;
  const whatsappUrl = isAllowedContactNumber(whatsapp)
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <article className={`relative flex h-full min-w-0 flex-col rounded-3xl border bg-white p-6 transition motion-reduce:transform-none sm:p-7 ${plan.featured ? "border-[#FF9400] shadow-[0_18px_45px_-28px_rgba(255,148,0,0.45)] ring-1 ring-[#FF9400]/25 hover:-translate-y-1 hover:shadow-[0_22px_55px_-28px_rgba(255,148,0,0.5)]" : "border-[#B9CCE0] shadow-sm hover:-translate-y-1 hover:border-[#1E3250]/40 hover:shadow-lg"}`}>
      {plan.featured && (
        <span className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF9400] px-3 py-1 text-xs font-black tracking-wide whitespace-nowrap text-[#1E3250] uppercase shadow-sm">
          Más elegido
        </span>
      )}
      <div className="border-b border-[#D5E2F0] pb-5">
        <p className="min-h-6 text-sm font-extrabold tracking-wide text-[#1E3250] uppercase">{plan.name}</p>
        <p className="mt-4 font-display text-4xl leading-none font-black tracking-[-0.04em] text-brand-navy-deep sm:text-5xl">
          {plan.speed_mbps} <span className="text-xl tracking-tight text-slate-500 sm:text-2xl">MB</span>
        </p>
        <dl className="mt-5 space-y-2 text-sm font-semibold text-slate-700">
          <div className="flex items-baseline justify-between gap-3"><dt><span className="mr-2 text-[#1E3250]" aria-hidden="true">↓</span>Bajada</dt><dd className="font-extrabold text-brand-navy-deep">{plan.speed_mbps} Mbps</dd></div>
          <div className="flex items-baseline justify-between gap-3"><dt><span className="mr-2 text-[#1E3250]" aria-hidden="true">↑</span>Subida</dt><dd className="text-right font-extrabold text-brand-navy-deep">{plan.upload_speed_mbps === null ? <span className="font-semibold text-slate-500">No informada</span> : <>{plan.upload_speed_mbps} Mbps</>}</dd></div>
        </dl>
        {plan.description && <p className="mt-4 text-sm leading-6 text-slate-600">{plan.description}</p>}
      </div>
      <div className="min-h-28 py-4">
        {promotionIsCurrent ? (
          <>
            {plan.promotion_label && <p className="mb-1 text-sm font-extrabold text-home-accent-strong">{plan.promotion_label}</p>}
            <p className="text-sm text-slate-500 line-through"><span className="sr-only">Precio regular: </span>{currency.format(plan.regular_price)}</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-brand-navy-deep sm:text-4xl">{currency.format(plan.promotional_price!)}</p>
            <p className="mt-1 text-sm text-slate-500">por mes · precio promocional</p>
          </>
        ) : (
          <>
            <p className="text-3xl font-black tracking-tight text-brand-navy-deep sm:text-4xl">{currency.format(plan.regular_price)}</p>
            <p className="mt-1 text-sm text-slate-500">por mes</p>
          </>
        )}
      </div>
      <div className="mt-auto">
        {plan.plan_features.length > 0 && (
          <ul className="space-y-2.5 border-t border-[#D5E2F0] pt-5" aria-label={`Características de ${plan.name}`}>
            {plan.plan_features.map((feature) => (
              <li className="flex gap-2.5 text-sm leading-5 text-slate-700" key={feature.id ?? `${feature.display_order}-${feature.text}`}>
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#EDF3FA] text-[#1E3250]" aria-hidden="true">
                  <Check size={13} strokeWidth={3.5} />
                </span>
                {feature.text}
              </li>
            ))}
          </ul>
        )}
        <a
          className={`mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl px-5 py-3 text-center font-extrabold transition duration-150 hover:brightness-105 motion-safe:hover:-translate-y-px motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 ${plan.featured ? "home-gradient text-[#1E3250] focus-visible:outline-home-accent" : "border border-[#1E3250] bg-[linear-gradient(135deg,#1E3250_0%,#293F5F_100%)] text-white focus-visible:outline-brand-navy"}`}
          data-home-action="commercial"
          href={whatsappUrl ?? "#contacto"}
          rel={whatsappUrl ? "noopener noreferrer" : undefined}
          target={whatsappUrl ? "_blank" : undefined}
        >
          Quiero este plan
        </a>
      </div>
    </article>
  );
}
