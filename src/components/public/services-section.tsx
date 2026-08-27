import { ServiceCard } from "@/components/public/service-card";
import type { Service } from "@/types/services";

export function ServicesSection({ services, unavailable }: Readonly<{ services: Service[]; unavailable: boolean }>) {
  return (
    <section className="scroll-mt-20 bg-white py-20 sm:py-28" id="servicios" aria-labelledby="services-title">
      <div className="public-container">
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div><p className="public-eyebrow">Servicios</p><h2 className="public-heading mt-3" id="services-title">Soluciones para seguir conectado</h2></div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:justify-self-end">Conocé los servicios activos que ofrecemos para acompañar distintas necesidades de conectividad.</p>
        </div>
        {unavailable ? (
          <p className="public-empty-state" role="status">Los servicios no están disponibles temporalmente.</p>
        ) : services.length === 0 ? (
          <p className="public-empty-state">Estamos actualizando nuestros servicios disponibles.</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => <ServiceCard index={index} key={service.id} service={service} />)}
          </div>
        )}
      </div>
    </section>
  );
}
