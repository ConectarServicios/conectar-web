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
  variant = "detail",
}: {
  plans: ConectarPlayPlan[];
  className?: string;
  showActions?: boolean;
  variant?: "detail" | "home";
}) {
  return (
    <div className={className ?? "grid gap-5 md:grid-cols-2"}>
      {plans.map((plan) => {
        const descriptionLines = getDescriptionLines(plan.description);
        const promotion = promotionIsCurrent(plan);
        const promotionText =
          plan.promotion_label ||
          (plan.promotion_discount_percent !== null
            ? `${Number(plan.promotion_discount_percent).toLocaleString("es-AR")}% de descuento${plan.promotion_duration_months !== null ? ` por ${plan.promotion_duration_months} meses` : ""}`
            : null);
        const showFootballLabel =
          plan.includes_football &&
          !descriptionIncludesFootballChannels(descriptionLines);

        return (
          <article
            className={`relative flex min-w-0 flex-col bg-white p-6 shadow-sm ${variant === "home" ? "rounded-3xl sm:p-7" : "rounded-2xl"} ${plan.featured ? (variant === "home" ? "border-2 border-emerald-500 ring-4 ring-emerald-100/70" : "border border-orange-400 ring-2 ring-orange-100") : "border border-slate-200"}`}
            key={plan.id}
          >
            {plan.featured && (
              <p className={variant === "home" ? "mb-3 w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-black tracking-wider text-emerald-800 uppercase" : "mb-3 text-xs font-black tracking-wider text-orange-700 uppercase"}>
                {variant === "home" ? "Más elegido" : "Destacado"}
              </p>
            )}
            <h3 className="text-xl font-black text-slate-950">{plan.name}</h3>
            {descriptionLines.length === 1 && (
              <p className="mt-2 leading-7 text-slate-600">
                {descriptionLines[0]}
              </p>
            )}
            {descriptionLines.length > 1 && (
              <ul className="mt-4 space-y-2 text-slate-600">
                {descriptionLines.map((line, index) => (
                  <li className="flex gap-2 leading-7" key={`${line}-${index}`}>
                    <span
                      className="font-black text-orange-600"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-5 break-words text-3xl font-black tracking-tight text-[#0b2440]">
              {money(Number(plan.promotional_price))}
              <span className="text-sm font-semibold text-slate-500">
                {" "}/ mes
              </span>
            </p>
            {promotion && promotionText && (
              <div className={`mt-4 rounded-xl p-3 text-sm font-bold ${variant === "home" ? "bg-emerald-50 text-emerald-900" : "bg-orange-50 text-orange-900"}`}>
                <p>{promotionText}</p>
              </div>
            )}
            {showFootballLabel && (
              <p className={`mt-4 font-bold text-slate-800 ${variant === "home" ? "flex items-center gap-2" : ""}`}>
                {variant === "home" && <span className="text-emerald-600" aria-hidden="true">✓</span>}
                Incluye Pack Fútbol
              </p>
            )}
            {showActions && (
              <Link
                className="mt-auto pt-6 text-sm font-black text-emerald-700 underline decoration-2 underline-offset-4 outline-none transition hover:text-emerald-900 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-emerald-600"
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
