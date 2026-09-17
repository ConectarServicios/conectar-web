import type { Metadata } from "next";
import Link from "next/link";

import { ServiceCatalogIcon } from "@/components/public/service-catalog-icon";
import {
  getPublicServiceGroups,
  getServicesByGroup,
} from "@/data/services/queries";

export const metadata: Metadata = {
  title: "Servicios | Conectar Servicios",
  description:
    "Soluciones de conectividad, seguridad, infraestructura y tecnología para hogares, empresas y organizaciones.",
};

export default function ServicesCatalogPage() {
  const groups = getPublicServiceGroups();

  return (
    <main className="bg-slate-50">
      <section className="bg-[#0b2440] py-20 text-white sm:py-28">
        <div className="public-container">
          <p className="text-sm font-bold tracking-[.22em] text-orange-400 uppercase">
            Servicios
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Soluciones para hogares, empresas y organizaciones
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Encontrá conectividad, seguridad, entretenimiento e infraestructura
            pensados para cada necesidad.
          </p>
        </div>
      </section>

      <section
        aria-label="Grupos de servicios"
        className="public-container py-16 sm:py-24"
      >
        <div className="grid gap-7 lg:grid-cols-2">
          {groups.map((group) => {
            const services = getServicesByGroup(group.slug);
            const href = group.hasLandingPage
              ? `/servicios/${group.slug}`
              : group.href;

            return (
              <article
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"
                key={group.slug}
              >
                <span
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-2xl bg-blue-950 text-white"
                >
                  <ServiceCatalogIcon icon={group.icon} />
                </span>
                <p className="mt-6 text-xs font-black tracking-[.18em] text-orange-700 uppercase">
                  {group.segments.includes("hogar") ? "Hogar" : "Corporativo"}
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {group.title}
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  {group.shortDescription}
                </p>
                <ul className="mt-6 grid gap-2 border-t border-slate-100 pt-5 sm:grid-cols-2">
                  {services.slice(0, 4).map((service) => (
                    <li
                      className="flex gap-2 text-sm font-semibold text-slate-700"
                      key={service.slug}
                    >
                      <span aria-hidden="true" className="text-orange-600">
                        •
                      </span>
                      {service.title}
                    </li>
                  ))}
                </ul>
                {href ? (
                  <Link
                    className="mt-7 inline-flex rounded-xl bg-blue-950 px-5 py-3 font-bold text-white hover:bg-blue-900"
                    href={href}
                  >
                    Ver todos los servicios
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
