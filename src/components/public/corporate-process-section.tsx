const steps = [
  { title: "Diagnóstico", description: "Relevamos tu infraestructura actual, necesidades y objetivos." },
  { title: "Propuesta", description: "Diseñamos una solución a medida con alcance y costos claros." },
  { title: "Implementación", description: "Ejecutamos la puesta en marcha sin frenar tu operación." },
  { title: "Soporte y monitoreo", description: "Acompañamiento continuo, con monitoreo y guardia." },
] as const;

const commitments = [
  { value: "24/7", label: "Monitoreo de infraestructura" },
  { value: "Local", label: "Soporte en Sunchales" },
  { value: "AR", label: "Tus datos en Argentina" },
  { value: "SLA", label: "Tiempos de respuesta acordados" },
] as const;

export function CorporateProcessSection() {
  return (
    <section
      aria-labelledby="corporate-process-title"
      className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-corporate-accent-strong uppercase sm:text-sm">Cómo trabajamos</p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-brand-navy text-balance sm:text-4xl lg:text-5xl"
            id="corporate-process-title"
          >
            De la consulta a la operación
          </h2>
        </div>

        <ol className="relative mt-10 grid gap-4 before:pointer-events-none before:absolute before:top-[46px] before:right-[46px] before:left-[46px] before:z-10 before:hidden before:h-px before:bg-corporate-accent/25 before:content-[''] sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5 lg:before:block">
          {steps.map((step, index) => (
            <li className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" key={step.title}>
              <span className="font-display relative z-20 flex size-11 items-center justify-center rounded-xl bg-corporate-accent text-lg font-bold text-white" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="font-display mt-5 text-xl font-bold tracking-[-0.02em] text-brand-navy">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>

        <dl className="mt-8 grid overflow-hidden rounded-2xl bg-brand-navy-deep text-white sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
          {commitments.map((commitment) => (
            <div
              className="border-white/10 px-5 py-5 not-last:border-b sm:px-6 sm:odd:border-r sm:nth-[2]:border-r-0 sm:nth-[3]:border-b-0 lg:not-last:border-r lg:not-last:border-b-0"
              key={commitment.value}
            >
              <dt className="font-display text-2xl font-bold tracking-[-0.04em] text-corporate-accent-soft sm:text-3xl">
                {commitment.value}
              </dt>
              <dd className="mt-2 text-sm leading-6 text-[#b8c9d9]">{commitment.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
