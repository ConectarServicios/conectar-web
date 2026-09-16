const steps = [
  { title: "Diagnóstico", description: "Relevamos tu infraestructura actual, necesidades y objetivos." },
  { title: "Propuesta", description: "Diseñamos una solución a medida con alcance y costos claros." },
  { title: "Implementación", description: "Ejecutamos la puesta en marcha sin frenar tu operación." },
  { title: "Soporte y monitoreo", description: "Acompañamiento continuo, con monitoreo y guardia." },
] as const;

export function CorporateProcessSection() {
  return (
    <section
      aria-labelledby="corporate-process-title"
      className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24 lg:py-28"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-[#2456d6] uppercase sm:text-sm">Cómo trabajamos</p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#0b2038] text-balance sm:text-4xl lg:text-5xl"
            id="corporate-process-title"
          >
            De la consulta a la operación
          </h2>
        </div>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <li className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7" key={step.title}>
              <span className="font-display flex size-11 items-center justify-center rounded-xl bg-[#2f6bff] text-lg font-bold text-white" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="font-display mt-7 text-xl font-bold tracking-[-0.02em] text-[#0b2038]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
              {index < steps.length - 1 && (
                <span className="absolute top-12 -right-3 hidden h-px w-6 bg-[#2f6bff]/40 lg:block" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
