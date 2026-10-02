import { ArrowRight } from "lucide-react";

type CorporateServicesCtaProps = {
  headingId: string;
};

export function CorporateServicesCta({
  headingId,
}: Readonly<CorporateServicesCtaProps>) {
  return (
    <aside
      aria-labelledby={headingId}
      className="mt-8 rounded-2xl border border-corporate-accent/20 bg-corporate-surface-soft px-5 py-6 sm:px-7 sm:py-7 lg:mt-10 lg:flex lg:items-center lg:justify-between lg:gap-8"
    >
      <div className="max-w-2xl">
        <h3
          className="font-display text-xl font-bold tracking-[-0.025em] text-brand-navy sm:text-2xl"
          id={headingId}
        >
          ¿Necesitás más información sobre alguna de estas soluciones?
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
          Contanos qué necesita tu empresa y te ayudamos a encontrar la
          alternativa adecuada.
        </p>
      </div>
      <a
        className="mt-5 inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-corporate-accent px-5 py-3 text-center font-bold text-white transition-colors hover:bg-corporate-accent-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-corporate-accent lg:mt-0 lg:w-auto"
        href="#contacto"
      >
        Hablar con un asesor
        <ArrowRight aria-hidden="true" className="size-4" />
      </a>
    </aside>
  );
}
