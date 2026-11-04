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
      className="bg-[#F7F9FC] py-16 sm:py-20"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-home-accent-strong uppercase sm:text-sm">
            Más que internet
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#071C31] text-balance sm:text-4xl lg:text-5xl"
            id="home-services-title"
          >
            Servicios para tu hogar
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10 lg:gap-5">
          {homeServices.map((service) => (
            <HomeServiceCard key={service.slug} service={service} />
          ))}

          <article className="group flex h-full flex-col rounded-2xl border border-[#D7E4F2] bg-white p-5 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-[#315C88]/40 hover:shadow-lg hover:shadow-slate-950/10 sm:p-6">
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-xl bg-[#EAF2FA] text-[#315C88] transition-[color,background-color,transform] duration-200 group-hover:scale-[1.04] group-hover:bg-[#315C88] group-hover:text-white motion-reduce:transform-none"
            >
              <Headset size={23} strokeWidth={2} />
            </span>
            <h3 className="font-display mt-4 text-lg font-bold tracking-[-0.025em] text-[#071C31] sm:text-xl">
              Atención local
            </h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
              Equipo en Sunchales con guardia fuera del horario habitual,
              también fines de semana.
            </p>
            <a
              className="mt-4 inline-flex min-h-11 w-fit max-w-full items-center justify-center gap-2 rounded-xl border border-[#315C88] bg-[#315C88] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315C88]"
              href="#contacto"
            >
              Conocer más
            </a>
          </article>
        </div>
        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            className="public-button-primary"
            href="/servicios"
          >
            Ver todos los servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
