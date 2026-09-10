import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceAreaIcon } from "@/components/public/service-area-icon";
import { LegacyServiceImage } from "@/components/public/legacy-service-image";
import { createClient } from "@/lib/supabase/server";
import { getPublicServiceBySlugs, serviceMediaUrl } from "@/lib/supabase/services";

type Props = Readonly<{ params: Promise<{ slug: string; serviceSlug: string }> }>;
const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, serviceSlug } = await params; const { data: service } = await getPublicServiceBySlugs(slug, serviceSlug);
  if (!service) return { title: "Servicio no encontrado | Conectar Servicios" };
  return { title: `${service.name} | Conectar Servicios`, description: service.short_description ?? service.description ?? `Conocé ${service.name}.`, alternates: { canonical: `/servicios/${slug}/${serviceSlug}` } };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug, serviceSlug } = await params; const [{ data: service }, supabase] = await Promise.all([getPublicServiceBySlugs(slug, serviceSlug), createClient()]);
  if (!service) notFound();
  const area = Array.isArray(service.service_areas) ? service.service_areas[0] : service.service_areas;
  if (!area) notFound();
  const media = service.service_media ?? []; const hero = media.find((item) => item.type === "hero");
  const managedHeroUrl = serviceMediaUrl(supabase, hero?.image_path ?? null);
  const gallery = media.filter((item) => item.type !== "hero"); const options = service.service_options ?? [];
  return <main>
    <section className="bg-[#0b2440] py-16 text-white sm:py-24"><div className="public-container grid items-center gap-10 lg:grid-cols-2">
      <div><Link className="font-bold text-blue-100 underline underline-offset-4 hover:text-white" href={`/servicios/${area.slug}`}>← Volver a {area.name}</Link><h1 className="mt-7 text-4xl font-black tracking-tight sm:text-6xl">{service.name}</h1>{service.short_description && <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">{service.short_description}</p>}</div>
      <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-3xl bg-blue-950">{managedHeroUrl ? <Image alt={hero?.alt_text ?? service.name} className="object-cover" fill priority sizes="(min-width: 1024px) 50vw, 100vw" src={managedHeroUrl}/> : <LegacyServiceImage alt={service.name} className="size-full object-cover" fallback={<ServiceAreaIcon icon={service.icon}/>} src={service.image_url} />}</div>
    </div></section>
    {service.description && <section className="public-container py-16 sm:py-24" aria-labelledby="service-description"><h2 className="text-3xl font-black text-slate-950" id="service-description">Acerca del servicio</h2><div className="mt-6 max-w-4xl whitespace-pre-line text-lg leading-8 text-slate-600">{service.description}</div></section>}
    {options.length > 0 && <section className="border-y border-blue-100 bg-blue-50/60 py-16 sm:py-24" aria-labelledby="service-options"><div className="public-container"><h2 className="text-3xl font-black text-slate-950" id="service-options">Opciones comerciales</h2><div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{options.map((option) => <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm" key={option.id}><p className="text-xs font-black tracking-widest text-orange-700 uppercase">{option.mode === "rental" ? "Alquiler" : "Compra"}</p><h3 className="mt-2 text-2xl font-black">{option.title}</h3>{option.equipment_count !== null && <p className="mt-3 text-sm font-bold text-slate-600">{option.equipment_count} {option.equipment_count === 1 ? "equipo" : "equipos"}</p>}<p className="mt-5 text-3xl font-black text-blue-900">{ars.format(Number(option.price))}</p>{option.price_label && <p className="mt-1 text-sm text-slate-500">{option.price_label}</p>}{option.description && <p className="mt-5 leading-7 text-slate-600">{option.description}</p>}</article>)}</div></div></section>}
    {gallery.length > 0 && <section className="public-container py-16 sm:py-24" aria-labelledby="service-gallery"><h2 className="text-3xl font-black text-slate-950" id="service-gallery">Galería</h2><div className="mt-9 grid gap-7 md:grid-cols-2">{gallery.map((item) => <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" key={item.id}><div className="relative aspect-[16/10]"><Image alt={item.alt_text ?? service.name} className="object-cover" fill sizes="(min-width: 768px) 50vw, 100vw" src={serviceMediaUrl(supabase, item.image_path)!}/></div>{item.caption && <figcaption className="p-5 text-sm leading-6 text-slate-600">{item.caption}</figcaption>}</figure>)}</div></section>}
    <section className="bg-blue-50 py-16"><div className="public-container text-center"><h2 className="text-3xl font-black text-slate-950">¿Necesitás más información?</h2><Link className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600" href="/#contacto">Contactanos</Link></div></section>
  </main>;
}
