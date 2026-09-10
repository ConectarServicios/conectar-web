import Image from "next/image";
import Link from "next/link";
import { ServiceAreaIcon } from "@/components/public/service-area-icon";
import { serviceHref } from "@/lib/supabase/services";
import type { PublicService } from "@/types/services";

export function FeaturedServicesSection({ imageUrls, services }: Readonly<{ imageUrls: Record<string, string | null>; services: PublicService[] }>) {
  if (!services.length) return null;
  return <section className="border-t border-blue-100 bg-blue-50/60 py-16 sm:py-24" aria-labelledby="featured-services-title"><div className="public-container">
    <p className="text-sm font-black tracking-[.2em] text-orange-700 uppercase">Servicios destacados</p>
    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl" id="featured-services-title">Soluciones que queremos acercarte</h2>
    <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">{services.map((service) => {
      const area = Array.isArray(service.service_areas) ? service.service_areas[0] : service.service_areas;
      if (!area) return null;
      const imageUrl = imageUrls[service.id] ?? service.image_url;
      return <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg" key={service.id}>
        <div className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-[#0b2440]">{imageUrl ? <Image alt={service.service_media?.[0]?.alt_text ?? service.name} className="object-cover transition duration-300 group-hover:scale-105" fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" src={imageUrl} /> : <ServiceAreaIcon icon={service.icon} />}</div>
        <div className="p-7"><p className="text-xs font-black tracking-widest text-orange-700 uppercase">{area.name}</p><h3 className="mt-2 text-2xl font-black text-slate-950">{service.name}</h3>{service.short_description && <p className="mt-3 leading-7 text-slate-600">{service.short_description}</p>}<Link className="mt-6 inline-flex font-bold text-blue-800 underline decoration-orange-500 decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600" href={serviceHref(area.slug, service.slug)}>Conocer más</Link></div>
      </article>;
    })}</div>
  </div></section>;
}
