import { ArrowUpRight, Headset } from "lucide-react";

import { HomeServiceCard } from "@/components/public/home-service-card";
import { getHomeServicesByGroup } from "@/data/services/queries";

const homeServices = [
  ...getHomeServicesByGroup("internet-wifi"),
  ...getHomeServicesByGroup("entretenimiento"),
];

export function HomeServicesSection() {
  return (
    <section
      aria-labelledby="home-services-title"
      className="bg-white py-16 sm:py-20"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-emerald-700 uppercase sm:text-sm">
            Más que internet
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#0b2038] text-balance sm:text-4xl lg:text-5xl"
            id="home-services-title"
          >
            Servicios para tu hogar
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10 lg:gap-5">
          {homeServices.map((service) => (
            <HomeServiceCard key={service.slug} service={service} />
          ))}

          <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-emerald-600/30 hover:shadow-lg hover:shadow-slate-950/10 sm:p-6">
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-700 group-hover:text-white"
            >
              <Headset size={23} strokeWidth={2} />
            </span>
            <h3 className="font-display mt-4 text-lg font-bold tracking-[-0.025em] text-[#0b2038] sm:text-xl">
              Atención local
            </h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
              Equipo en Sunchales con guardia fuera del horario habitual,
              también fines de semana.
            </p>
            <a
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-sm text-sm font-bold text-emerald-700 outline-none transition-colors hover:text-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
              href="#contacto"
            >
              Conocer más
              <ArrowUpRight
                aria-hidden="true"
                size={16}
                strokeWidth={2.5}
              />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
