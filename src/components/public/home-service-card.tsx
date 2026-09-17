import { ArrowUpRight } from "lucide-react";

import { ServiceCatalogIcon } from "@/components/public/service-catalog-icon";
import type { ServiceDefinition } from "@/data/services/types";

type HomeServiceCardProps = {
  service: ServiceDefinition;
};

export function HomeServiceCard({ service }: HomeServiceCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-emerald-600/30 hover:shadow-lg hover:shadow-slate-950/10 sm:p-6">
      <span
        aria-hidden="true"
        className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-700 group-hover:text-white"
      >
        <ServiceCatalogIcon icon={service.icon} />
      </span>
      <h3 className="font-display mt-4 text-lg font-bold tracking-[-0.025em] text-[#0b2038] sm:text-xl">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {service.shortDescription}
      </p>
      <a
        className="mt-4 inline-flex w-fit items-center gap-2 rounded-sm text-sm font-bold text-emerald-700 outline-none transition-colors hover:text-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
        href={service.href ?? "#contacto"}
      >
        {service.cta?.label ?? "Conocer más"}
        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.5} />
      </a>
    </article>
  );
}
