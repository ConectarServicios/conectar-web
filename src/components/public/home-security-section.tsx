import { HomeServiceCard } from "@/components/public/home-service-card";
import { getHomeServicesByGroup } from "@/data/services/queries";

const securityServices = getHomeServicesByGroup("seguridad-hogar");

export function HomeSecuritySection() {
  return (
    <section
      aria-labelledby="home-security-title"
      className="border-y border-home-border bg-home-surface-soft py-16 sm:py-20"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-home-accent-strong uppercase sm:text-sm">
            Seguridad para tu hogar
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-brand-navy text-balance sm:text-4xl lg:text-5xl"
            id="home-security-title"
          >
            Cuidá tu casa — la instalamos nosotros
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Alarmas, cámaras y control smart desde tu celular, con instalación
            y soporte del mismo equipo local.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:mt-10 lg:gap-5">
          {securityServices.map((service) => (
            <HomeServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
