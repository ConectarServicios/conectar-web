import { ServiceCatalogIcon } from "@/components/public/service-catalog-icon";
import type { ServiceDefinition } from "@/data/services/types";

type HomeServiceCardProps = {
  service: ServiceDefinition;
};

export function HomeServiceCard({ service }: HomeServiceCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#D7E4F2] bg-white p-5 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-[#315C88]/40 hover:shadow-lg hover:shadow-slate-950/10 sm:p-6">
      <span
        aria-hidden="true"
        className="flex size-11 items-center justify-center rounded-xl bg-[#EAF2FA] text-[#315C88] transition-[color,background-color,transform] duration-200 group-hover:scale-[1.04] group-hover:bg-[#315C88] group-hover:text-white motion-reduce:transform-none"
      >
        <ServiceCatalogIcon icon={service.icon} />
      </span>
      <h3 className="font-display mt-4 text-lg font-bold tracking-[-0.025em] text-[#071C31] sm:text-xl">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {service.shortDescription}
      </p>
      <a
        className="mt-4 inline-flex min-h-11 w-fit max-w-full items-center justify-center gap-2 rounded-xl border border-[#315C88] bg-[#315C88] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315C88]"
        data-home-action="card-link"
        href={service.href ?? "#contacto"}
      >
        {service.cta?.label ?? "Conocer más"}
      </a>
    </article>
  );
}
