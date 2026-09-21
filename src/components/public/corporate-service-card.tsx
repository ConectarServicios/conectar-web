import { ServiceCatalogIcon } from "@/components/public/service-catalog-icon";
import type { ServiceDefinition } from "@/data/services/types";

type CorporateServiceCardProps = {
  service: ServiceDefinition;
  tone?: "white" | "slate";
};

export function CorporateServiceCard({
  service,
  tone = "white",
}: CorporateServiceCardProps) {
  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border border-slate-200 p-5 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-corporate-accent/30 hover:shadow-lg hover:shadow-slate-950/10 sm:p-6 ${
        tone === "slate" ? "bg-white" : "bg-slate-50/60"
      }`}
    >
      <span
        aria-hidden="true"
        className="flex size-11 items-center justify-center rounded-xl bg-corporate-surface-soft text-corporate-accent-strong transition-[color,background-color,transform] duration-200 group-hover:scale-[1.04] group-hover:bg-corporate-accent group-hover:text-white motion-reduce:transform-none"
      >
        <ServiceCatalogIcon icon={service.icon} />
      </span>
      <h3 className="font-display mt-4 text-lg font-bold tracking-[-0.025em] text-brand-navy sm:text-xl">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {service.shortDescription}
      </p>
      <a
        className="mt-4 inline-flex min-h-11 w-fit max-w-full items-center justify-center gap-2 rounded-xl border border-corporate-accent bg-corporate-surface-soft px-4 py-2 text-sm font-bold text-corporate-accent-strong transition-colors hover:bg-corporate-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-corporate-accent"
        href={service.href ?? "#contacto"}
      >
        {service.hasDetailPage ? "Conocer más" : "Consultar"}
      </a>
    </article>
  );
}
