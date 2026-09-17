import { CorporateServiceCard } from "@/components/public/corporate-service-card";
import { getCorporateServicesByGroup } from "@/data/services/queries";

const services = getCorporateServicesByGroup("infraestructura");

export function CorporateInfrastructureSection() {
  return (
    <section
      aria-labelledby="corporate-infrastructure-title"
      className="bg-white py-16 sm:py-20 lg:py-20"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-[#2456d6] uppercase sm:text-sm">
            Data center y servicios digitales
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#0b2038] text-balance sm:text-4xl lg:text-5xl"
            id="corporate-infrastructure-title"
          >
            Infraestructura física y virtual
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-5">
          {services.map((service) => (
            <CorporateServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
