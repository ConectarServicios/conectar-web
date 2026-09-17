import { CorporateServiceCard } from "@/components/public/corporate-service-card";
import { getCorporateServicesByGroup } from "@/data/services/queries";

const services = getCorporateServicesByGroup("seguridad-gestionada");

export function CorporateSecuritySection() {
  return (
    <section
      aria-labelledby="corporate-security-title"
      className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-20"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-corporate-accent-strong uppercase sm:text-sm">
            Seguridad gestionada
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-brand-navy text-balance sm:text-4xl lg:text-5xl"
            id="corporate-security-title"
          >
            Protección, monitoreo y respuesta
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-5">
          {services.map((service) => (
            <CorporateServiceCard
              key={service.slug}
              service={service}
              tone="slate"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
