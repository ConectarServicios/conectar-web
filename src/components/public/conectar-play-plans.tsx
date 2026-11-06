import type { ConectarPlayPlan } from "@/types/conectar-play";
import Link from "next/link";

const money = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(value);

export function promotionIsCurrent(
  plan: ConectarPlayPlan,
  now = Date.now(),
) {
  return (
    (!plan.promotion_start || Date.parse(plan.promotion_start) <= now) &&
    (!plan.promotion_end || Date.parse(plan.promotion_end) >= now)
  );
}

function getDescriptionLines(description: string | null) {
  return (description ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function descriptionIncludesFootballChannels(lines: string[]) {
  return lines.some((line) => /espn premium|tnt sports/i.test(line));
}

export function ConectarPlayPlans({
  plans,
  className,
  showActions = false,
  variant = "default",
}: {
  plans: ConectarPlayPlan[];
  className?: string;
  showActions?: boolean;
  variant?: "default" | "home";
}) {
  const isHome = variant === "home";

  return (
    <div className={className ?? "grid gap-5 md:grid-cols-2 xl:grid-cols-3"}>
      {plans.map((plan) => {
        const descriptionLines = getDescriptionLines(plan.description);
        const promotion = promotionIsCurrent(plan);
        const standardPromotionText =
          plan.promotion_discount_percent !== null
            ? `${Number(plan.promotion_discount_percent).toLocaleString("es-AR")}% de descuento${plan.promotion_duration_months !== null ? ` por ${plan.promotion_duration_months} meses` : ""}`
            : null;
        const promotionText = plan.promotion_label || standardPromotionText;
        const showDiscountOffer =
          isHome &&
          Number(plan.promotion_discount_percent) === 50 &&
          Number(plan.promotion_duration_months) === 6 &&
          (!plan.promotion_label || plan.promotion_label.trim() === standardPromotionText);
        const showFootballLabel =
          plan.includes_football &&
          !descriptionIncludesFootballChannels(descriptionLines);

        return (
          <article
            className={`relative flex min-w-0 flex-col rounded-3xl bg-white shadow-sm ${isHome ? `border p-5 sm:p-6 ${plan.featured ? "border-[#FF9400] ring-1 ring-[#FF9400]/25" : "border-[#B9CCE0]"}` : `p-6 sm:p-7 ${plan.featured ? "border-2 border-home-accent ring-4 ring-home-surface/70" : "border border-home-border"}`}`}
            key={plan.id}
          >
            {plan.featured && (
              <p className={isHome ? "absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF9400] px-3 py-1 text-xs font-black tracking-wide whitespace-nowrap text-[#1E3250] uppercase shadow-sm" : "absolute -top-3 left-6 rounded-full bg-home-accent-strong px-3 py-1 text-xs font-black tracking-wider text-white uppercase shadow-sm"}>
                Más elegido
              </p>
            )}
            <h3 className="text-xl font-black text-slate-950">{plan.name}</h3>
            {isHome && descriptionLines.length > 0 && (
              <ul className="mt-3 flex flex-wrap items-start gap-2">
                {descriptionLines.map((line, index) => (
                  <li className="max-w-full rounded-full bg-[#EAF2FA] px-3 py-1.5 text-sm leading-5 font-semibold break-words text-[#24476D]" key={`${line}-${index}`}>
                    {line}
                  </li>
                ))}
              </ul>
            )}
            {!isHome && descriptionLines.length === 1 && (
              <p className="mt-2 leading-7 text-slate-600">
                {descriptionLines[0]}
              </p>
            )}
            {!isHome && descriptionLines.length > 1 && (
              <ul className="mt-4 space-y-2 text-slate-600">
                {descriptionLines.map((line, index) => (
                  <li className="flex gap-2 leading-7" key={`${line}-${index}`}>
                    <span className="font-black text-home-accent-strong" aria-hidden="true">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
            {isHome && showFootballLabel && (
              <p className="mt-2">
                <span className="inline-block max-w-full rounded-full bg-[#EAF2FA] px-3 py-1.5 text-sm leading-5 font-semibold break-words text-[#24476D]">
                  Incluye Pack Fútbol
                </span>
              </p>
            )}
            <p className={`${isHome ? "mt-auto pt-6" : "mt-5"} break-words text-3xl font-black tracking-tight text-brand-navy`}>
              {money(Number(plan.promotional_price))}
              <span className="text-sm font-semibold text-slate-500">
                {" "}/ mes
              </span>
            </p>
            {promotion && promotionText && (
              isHome ? (
                <div className="mt-4 border-t border-[#D7E4F2] pt-4">
                  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#D7E4F2] bg-[#F7F9FC] p-3 text-sm text-brand-navy">
                    {showDiscountOffer ? (
                      <>
                        <span className="shrink-0 rounded-lg bg-[#FFE8D5] px-3 py-2 text-base font-black text-[#9A4500]">
                          {Number(plan.promotion_discount_percent).toLocaleString("es-AR")}% OFF
                        </span>
                        <div className="min-w-0">
                          <p className="font-extrabold">Promoción especial</p>
                          <p className="mt-0.5 leading-5 text-slate-600">
                            Durante los primeros {plan.promotion_duration_months} meses
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="font-bold break-words">{promotionText}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-home-surface p-3 text-sm font-bold text-brand-navy">
                  <p>{promotionText}</p>
                </div>
              )
            )}
            {!isHome && showFootballLabel && (
              <p className="mt-4 flex items-center gap-2 font-bold text-slate-800">
                <span className="text-home-accent" aria-hidden="true">✓</span>
                Incluye Pack Fútbol
              </p>
            )}
            {showActions && (
              <Link
                className="mt-auto pt-6 text-sm font-black text-home-accent-strong underline decoration-2 underline-offset-4 outline-none transition hover:text-brand-navy focus-visible:rounded focus-visible:ring-2 focus-visible:ring-home-accent"
                href="/conectar-play#planes-play"
              >
                Ver detalles del plan
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
}
