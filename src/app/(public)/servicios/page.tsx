import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ServiceCatalogIcon } from "@/components/public/service-catalog-icon";
import {
  getPublicServiceGroupsBySegment,
  getServicesByGroup,
} from "@/data/services/queries";
import type {
  ServiceGroupDefinition,
  ServiceSegment,
} from "@/data/services/types";

export const metadata: Metadata = {
  title: "Servicios | Conectar Servicios",
  description:
    "Soluciones de conectividad, seguridad, infraestructura y tecnología para hogares, empresas y organizaciones.",
};

const segments: readonly {
  slug: ServiceSegment;
  title: string;
  description: string;
}[] = [
  {
    slug: "hogar",
    title: "Hogar",
    description:
      "Conectividad, seguridad y entretenimiento para disfrutar tu casa con tranquilidad.",
  },
  {
    slug: "corporativo",
    title: "Corporativo",
    description:
      "Soluciones integrales para acompañar la operación de empresas y organizaciones.",
  },
];

function ServiceGroupDisclosure({
  group,
  segment,
}: Readonly<{
  group: ServiceGroupDefinition;
  segment: ServiceSegment;
}>) {
  const services = getServicesByGroup(group.slug);
  const accentClasses = segment === "hogar"
    ? "bg-home-surface text-home-accent-strong"
    : "bg-blue-50 text-corporate-accent-strong";

  return (
    <details
      className="group scroll-mt-24 rounded-2xl border border-home-border bg-white shadow-sm shadow-slate-950/5 open:shadow-md"
      id={group.slug}
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 rounded-2xl p-5 outline-none marker:hidden focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 sm:p-6 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className={`grid size-11 shrink-0 place-items-center rounded-xl ${accentClasses}`}
        >
          <ServiceCatalogIcon icon={group.icon} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-display block text-lg font-bold tracking-[-0.025em] text-brand-navy sm:text-xl">
            {group.title}
          </span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">
            {group.shortDescription}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
          strokeWidth={2.25}
        />
      </summary>

      <ul className="border-t border-home-border/60 px-5 py-2 sm:px-6">
        {services.map((service) => {
          const hasOwnDestination = Boolean(
            service.href && service.href !== "#contacto",
          );
          const href = service.hasDetailPage
            ? `/servicios/${group.slug}/${service.slug}`
            : hasOwnDestination
              ? service.href!
              : "/#contacto";

          return (
            <li
              className="flex flex-col gap-3 border-b border-home-border/60 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              key={service.slug}
            >
              <span className="min-w-0 sm:pr-6">
                <span className="block font-bold text-slate-950">
                  {service.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  {service.shortDescription}
                </span>
              </span>
              <Link
                className="inline-flex w-fit shrink-0 rounded-sm text-sm font-bold text-blue-800 underline decoration-orange-500 decoration-2 underline-offset-4 outline-none hover:text-blue-950 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-4"
                href={href}
              >
                {hasOwnDestination ? service.cta?.label ?? "Conocer más" : "Consultar"}
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

export default function ServicesCatalogPage() {
  return (
    <main className="bg-home-surface-soft">
      <section className="bg-brand-navy py-20 text-white sm:py-28">
        <div className="public-container">
          <p className="text-sm font-bold tracking-[.22em] text-orange-400 uppercase">
            Servicios
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Soluciones para hogares, empresas y organizaciones
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Explorá nuestro catálogo y encontrá la solución adecuada para cada
            necesidad.
          </p>
        </div>
      </section>

      <div className="public-container space-y-16 py-16 sm:space-y-20 sm:py-24">
        {segments.map((segment) => {
          const groups = getPublicServiceGroupsBySegment(segment.slug);

          return (
            <section aria-labelledby={`${segment.slug}-title`} key={segment.slug}>
              <div className="max-w-3xl">
                <h2
                  className="font-display text-3xl font-bold tracking-[-0.035em] text-brand-navy sm:text-4xl"
                  id={`${segment.slug}-title`}
                >
                  {segment.title}
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  {segment.description}
                </p>
              </div>
              <div className="mt-8 grid items-start gap-5 lg:grid-cols-2">
                {groups.map((group) => (
                  <ServiceGroupDisclosure
                    group={group}
                    key={group.slug}
                    segment={segment.slug}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
