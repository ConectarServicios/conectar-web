import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { LegacyServiceImage } from "@/components/public/legacy-service-image";
import { ServiceAreaIcon } from "@/components/public/service-area-icon";
import { serviceHref } from "@/lib/supabase/services";
import type { PublicService } from "@/types/services";

type HomeSecuritySectionProps = Readonly<{
  imageUrls: Record<string, string | null>;
  services: PublicService[];
  unavailable: boolean;
}>;

export function HomeSecuritySection({ imageUrls, services, unavailable }: HomeSecuritySectionProps) {
  if (!unavailable && services.length === 0) return null;

  return (
    <section aria-labelledby="home-security-title" className="overflow-hidden bg-[#071d33] py-20 text-white sm:py-28">
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[.2em] text-orange-400 uppercase">Seguridad para tu hogar</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-balance sm:text-5xl" id="home-security-title">
            Cuidá tu casa — la instalamos nosotros
          </h2>
          <p className="mt-5 text-lg leading-8 text-blue-100">
            Alarmas, cámaras y control smart desde tu celular, con instalación y soporte del mismo equipo local.
          </p>
        </div>

        {unavailable ? (
          <p className="mt-12 rounded-2xl border border-white/15 bg-white/5 p-8 text-center text-blue-100" role="status">
            Las soluciones de seguridad no están disponibles temporalmente.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {services.map((service) => {
              const area = Array.isArray(service.service_areas) ? service.service_areas[0] : service.service_areas;
              if (!area) return null;

              const managedImageUrl = imageUrls[service.id];
              const media = service.service_media?.[0];

              return (
                <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white text-slate-950 shadow-2xl shadow-black/15" key={service.id}>
                  <div className="relative grid aspect-[16/9] place-items-center overflow-hidden bg-[#0d3154]">
                    {managedImageUrl ? (
                      <Image
                        alt={media?.alt_text ?? service.name}
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        src={managedImageUrl}
                      />
                    ) : (
                      <LegacyServiceImage
                        alt={service.name}
                        className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        fallback={<ServiceAreaIcon icon={service.icon ?? "security"} />}
                        src={service.image_url}
                      />
                    )}
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#071d33]/55 via-transparent to-transparent" />
                  </div>

                  <div className="p-7 sm:p-8">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-xs font-black tracking-[.16em] text-orange-700 uppercase">{area.name}</p>
                        <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{service.name}</h3>
                      </div>
                      {service.featured && <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-800">Destacado</span>}
                    </div>
                    {service.short_description && <p className="mt-4 leading-7 text-slate-600">{service.short_description}</p>}
                    <Link className="mt-7 inline-flex items-center gap-2 font-black text-blue-900 underline decoration-orange-500 decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600" href={serviceHref(area.slug, service.slug)}>
                      Conocer la solución
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
