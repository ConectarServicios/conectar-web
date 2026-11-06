import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ServiceCatalogIcon } from "@/components/public/service-catalog-icon";
import { ServiceCatalogSwitcher } from "@/components/public/service-catalog-switcher";
import {
  getPublicServiceGroupsBySegment,
  getServicesByGroup,
  getServiceContactHref,
} from "@/data/services/queries";
import type { ServiceGroupDefinition, ServiceSegment } from "@/data/services/types";

export const metadata: Metadata = {
  title: "Servicios | Conectar Servicios",
  description:
    "Soluciones de conectividad, seguridad, infraestructura y tecnología para hogares, empresas y organizaciones.",
  alternates: { canonical: "/servicios" },
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


function ServiceGroupCard({
  group,
  segment,
}: Readonly<{ group: ServiceGroupDefinition; segment: ServiceSegment }>) {
  const services = getServicesByGroup(group.slug);
  const wide = segment === "corporativo" && services.length > 6;

  return (
    <article
      className={`min-w-0 scroll-mt-24 rounded-2xl border border-[#D7E4F2] bg-white p-5 shadow-sm sm:p-6 ${wide ? "lg:col-span-2" : ""}`}
      id={group.slug}
      aria-labelledby={`${group.slug}-title`}
    >
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#EAF2FA] text-[#315C88] ring-1 ring-[#B9CCE0]/50">
          <ServiceCatalogIcon icon={group.icon} />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg leading-6 font-black text-[#071C31] sm:text-xl sm:leading-7" id={`${group.slug}-title`}>{group.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{group.shortDescription}</p>
        </div>
      </div>
      <ul className={`mt-6 grid gap-4 ${wide ? "sm:grid-cols-2 xl:grid-cols-3" : segment === "corporativo" ? "sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" : ""}`}>
        {services.map((service) => {
          const hasOwnDestination = Boolean(service.href && service.href !== "#contacto");
          const href = service.slug === "wifi-power-mesh"
            ? "/noticias/wifi-power-mesh-mas-cobertura-wi-fi-para-tu-hogar"
            : service.hasDetailPage
              ? `/servicios/${group.slug}/${service.slug}`
              : hasOwnDestination
                ? service.href!
                : getServiceContactHref(segment);

          return (
            <li className="flex min-w-0 flex-col rounded-xl bg-[#F7F9FC] p-4" key={service.slug}>
              <h4 className="font-bold leading-6 break-words text-[#071C31]">{service.title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.shortDescription}</p>
              <Link
                className="group/link mt-auto inline-flex min-h-11 w-fit max-w-full items-center gap-2 rounded-sm pt-3 text-sm font-bold text-[#315C88] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#315C88]"
                href={href}
                aria-label={`${hasOwnDestination ? service.cta?.label ?? "Conocer más" : "Consultar"}: ${service.title}`}
              >
                {hasOwnDestination ? service.cta?.label ?? "Conocer más" : "Consultar"}
                <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-colors duration-150 group-hover/link:text-home-accent-strong motion-reduce:transition-none" strokeWidth={1.75} />
              </Link>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default function ServicesCatalogPage() {
  const panels = segments.map((segment) => {
    const groups = getPublicServiceGroupsBySegment(segment.slug);
    return {
      slug: segment.slug,
      title: segment.title,
      description: segment.description,
      groupIds: groups.map((group) => group.slug),
      content: (
        <div className={`mt-7 grid items-start gap-5 ${segment.slug === "hogar" ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
          {groups.map((group) => <ServiceGroupCard group={group} key={group.slug} segment={segment.slug} />)}
        </div>
      ),
    };
  });

  return (
    <main className="bg-[#F7F9FC]">
      <section className="bg-[#071C31] py-8 text-white sm:py-10">
        <div className="public-container">
          <p className="text-xs font-black tracking-[.18em] text-[#FFAD52] uppercase">Servicios Conectar</p>
          <h1 className="mt-3 text-3xl leading-tight font-black tracking-tight text-balance sm:text-4xl">Soluciones para cada necesidad</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#D7E4F2]">Descubrí nuestros servicios de conectividad, entretenimiento, seguridad e infraestructura</p>
        </div>
      </section>
      <div className="public-container py-8 sm:py-10">
        <Suspense fallback={<p className="text-slate-600" role="status">Cargando catálogo de servicios…</p>}>
          <ServiceCatalogSwitcher panels={panels} />
        </Suspense>
      </div>
    </main>
  );
}
