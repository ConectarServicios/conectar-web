import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { ServiceCatalogIcon } from "@/components/public/service-catalog-icon";
import {
  getServiceGroupBySlug,
  getServicesByGroup,
} from "@/data/services/queries";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

const legacyGroupRedirects: Readonly<Record<string, string>> = {
  "conectar-play": "/conectar-play",
  "conectividad-empresas": "/servicios/conectividad",
  "data-center-servicios-digitales": "/servicios/infraestructura",
  "seguridad-monitoreo": "/servicios/seguridad-hogar",
  "software-tecnologia": "/servicios/seguridad-gestionada",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const group = getServiceGroupBySlug(slug);

  if (!group) return { title: "Grupo no encontrado | Conectar Servicios" };

  return {
    title: `${group.title} | Conectar Servicios`,
    description: group.shortDescription,
    alternates: { canonical: `/servicios/${group.slug}` },
  };
}

export default async function ServiceGroupPage({ params }: Props) {
  const { slug } = await params;
  const legacyDestination = legacyGroupRedirects[slug];

  if (legacyDestination) permanentRedirect(legacyDestination);

  const group = getServiceGroupBySlug(slug);
  if (!group) notFound();
  if (!group.hasLandingPage && group.href) permanentRedirect(group.href);
  if (!group.hasLandingPage) notFound();

  const services = getServicesByGroup(group.slug);

  return (
    <main>
      <section className="bg-[#0b2440] py-20 text-white sm:py-28">
        <div className="public-container">
          <p className="text-sm font-bold tracking-[.22em] text-orange-400 uppercase">
            Servicios
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            {group.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            {group.shortDescription}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="group-services"
        className="public-container py-16 sm:py-24"
      >
        <h2 className="text-3xl font-black text-slate-950 sm:text-4xl" id="group-services">
          Servicios disponibles
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const href = service.hasDetailPage
              ? `/servicios/${group.slug}/${service.slug}`
              : service.href === "#contacto"
                ? "/#contacto"
                : service.href;

            return (
              <article
                className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
                key={service.slug}
              >
                <span
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-2xl bg-blue-950 text-white"
                >
                  <ServiceCatalogIcon icon={service.icon} />
                </span>
                <h3 className="mt-6 text-2xl font-black text-slate-950">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 leading-7 text-slate-600">
                  {service.shortDescription}
                </p>
                {href ? (
                  <Link
                    className="mt-6 inline-flex w-fit font-bold text-blue-800 underline decoration-orange-500 decoration-2 underline-offset-4"
                    href={href}
                  >
                    {service.cta?.label ?? "Conocer más"}
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-blue-50 py-16">
        <div className="public-container text-center">
          <h2 className="text-3xl font-black text-slate-950">
            ¿Necesitás más información?
          </h2>
          <Link
            className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700"
            href="/#contacto"
          >
            Contactanos
          </Link>
        </div>
      </section>
    </main>
  );
}
