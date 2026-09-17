import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { ServiceCatalogIcon } from "@/components/public/service-catalog-icon";
import {
  getServiceBySlugs,
  getServiceGroupBySlug,
} from "@/data/services/queries";

type Props = Readonly<{
  params: Promise<{ slug: string; serviceSlug: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, serviceSlug } = await params;
  const service = getServiceBySlugs(slug, serviceSlug);

  if (!service?.hasDetailPage) {
    return { title: "Servicio no encontrado | Conectar Servicios" };
  }

  return {
    title: `${service.title} | Conectar Servicios`,
    description: service.shortDescription,
    alternates: { canonical: `/servicios/${slug}/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug, serviceSlug } = await params;
  const group = getServiceGroupBySlug(slug);
  const service = getServiceBySlugs(slug, serviceSlug);

  if (!group || !service) notFound();
  if (!service.hasDetailPage && service.href?.startsWith("/")) {
    permanentRedirect(service.href);
  }
  if (!service.hasDetailPage || !service.detail) notFound();

  return (
    <main>
      <section className="bg-[#0b2440] py-16 text-white sm:py-24">
        <div className="public-container">
          <Link
            className="font-bold text-blue-100 underline underline-offset-4 hover:text-white"
            href={`/servicios/${group.slug}`}
          >
            ← Volver a {group.title}
          </Link>
          <span
            aria-hidden="true"
            className="mt-8 grid size-14 place-items-center rounded-2xl bg-white/10 text-white"
          >
            <ServiceCatalogIcon icon={service.icon} size={28} />
          </span>
          <h1 className="mt-7 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            {service.shortDescription}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="service-description"
        className="public-container py-16 sm:py-24"
      >
        <h2 className="text-3xl font-black text-slate-950" id="service-description">
          Acerca del servicio
        </h2>
        <p className="mt-6 max-w-4xl whitespace-pre-line text-lg leading-8 text-slate-600">
          {service.detail.description ?? service.description}
        </p>
        <Link
          className="mt-8 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700"
          href="/#contacto"
        >
          Contactanos
        </Link>
      </section>
    </main>
  );
}
