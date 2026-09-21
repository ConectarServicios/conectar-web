import { Headset } from "lucide-react";
import Link from "next/link";

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
          <p className="text-xs font-black tracking-[0.2em] text-home-accent-strong uppercase sm:text-sm">
            Más que internet
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-brand-navy text-balance sm:text-4xl lg:text-5xl"
            id="home-services-title"
          >
            Servicios para tu hogar
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10 lg:gap-5">
          {homeServices.map((service) => (
            <HomeServiceCard key={service.slug} service={service} />
          ))}

          <article className="group flex h-full flex-col rounded-2xl border border-home-border bg-white p-5 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-home-accent-strong/30 hover:shadow-lg hover:shadow-slate-950/10 sm:p-6">
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-xl bg-home-surface text-home-accent-strong transition-colors group-hover:bg-home-accent-strong group-hover:text-white"
            >
              <Headset size={23} strokeWidth={2} />
            </span>
            <h3 className="font-display mt-4 text-lg font-bold tracking-[-0.025em] text-brand-navy sm:text-xl">
              Atención local
            </h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
              Equipo en Sunchales con guardia fuera del horario habitual,
              también fines de semana.
            </p>
            <a
              className="mt-4 inline-flex min-h-11 w-fit max-w-full items-center justify-center gap-2 rounded-xl border border-home-accent-strong bg-home-surface px-4 py-2 text-sm font-bold text-home-accent-strong transition-colors hover:bg-home-accent-strong hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-accent"
              href="#contacto"
            >
              Conocer más
            </a>
          </article>
        </div>
        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-home-accent-strong px-5 py-2.5 text-sm font-bold text-home-accent-strong transition-colors hover:bg-home-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-accent"
            href="/servicios"
          >
            Ver todos los servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
