import { ArrowUpRight } from "lucide-react";

import { ServiceCatalogIcon } from "@/components/public/service-catalog-icon";
import type { ServiceDefinition } from "@/data/services/types";

type HomeServiceCardProps = {
  service: ServiceDefinition;
};

export function HomeServiceCard({ service }: HomeServiceCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-home-border bg-white p-5 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-home-accent-strong/30 hover:shadow-lg hover:shadow-slate-950/10 sm:p-6">
      <span
        aria-hidden="true"
        className="flex size-11 items-center justify-center rounded-xl bg-home-surface text-home-accent-strong transition-colors group-hover:bg-home-accent-strong group-hover:text-white"
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
        className="mt-4 inline-flex w-fit items-center gap-2 rounded-sm text-sm font-bold text-home-accent-strong outline-none transition-colors hover:text-brand-navy focus-visible:ring-2 focus-visible:ring-home-accent focus-visible:ring-offset-4"
        href={service.href ?? "#contacto"}
      >
        {service.cta?.label ?? "Conocer más"}
        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.5} />
      </a>
    </article>
  );
}
