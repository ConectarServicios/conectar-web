import { ServiceCatalogIcon } from "@/components/public/service-catalog-icon";
import type { ServiceDefinition } from "@/data/services/types";

type CorporateServiceCardProps = {
  service: ServiceDefinition;
  tone?: "white" | "slate";
  accent?: "corporate";
};

export function CorporateServiceCard({
  service,
  tone = "white",
  accent,
}: CorporateServiceCardProps) {
  const hasCorporateAccent = accent === "corporate";

  return (
    <article
      className={`group h-full rounded-2xl border border-slate-200 p-5 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-950/10 sm:p-6 ${
        hasCorporateAccent
          ? "relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-corporate-accent before:transition-colors before:duration-200 hover:border-corporate-accent/50 hover:before:bg-corporate-accent-strong"
          : "hover:border-corporate-accent/30"
      } ${
        tone === "slate" ? "bg-white" : "bg-slate-50/60"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex size-11 items-center justify-center rounded-xl bg-corporate-surface-soft text-corporate-accent-strong transition-[color,background-color,transform] duration-200 group-hover:scale-[1.04] motion-reduce:transform-none ${
          hasCorporateAccent
            ? "group-hover:bg-corporate-accent/15 group-hover:text-corporate-accent-strong"
            : "group-hover:bg-corporate-accent group-hover:text-white"
        }`}
      >
        <ServiceCatalogIcon icon={service.icon} />
      </span>
      <h3 className="font-display mt-4 text-lg font-bold tracking-[-0.025em] text-brand-navy sm:text-xl">
        {service.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {service.shortDescription}
      </p>
    </article>
  );
}
