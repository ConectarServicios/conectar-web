const metrics = [
  { value: "+3.500", label: "Clientes conectados" },
  { value: "Local", label: "Atención en Sunchales" },
  { value: "24/7", label: "Guardia de soporte" },
  { value: "4.8/5", label: "Satisfacción de clientes" },
] as const;

const testimonials = [
  {
    quote:
      "Instalaron el internet y las cámaras en casa el mismo día. Miro todo desde el celular y ante cualquier duda me atienden al toque.",
    name: "Lucía F.",
    role: "Cliente hogar",
    initial: "L",
  },
  {
    quote:
      "Un fin de semana se me cortó el servicio y la guardia respondió en minutos. Ese nivel de respuesta no lo tenía antes.",
    name: "Jorge M.",
    role: "Cliente hogar",
    initial: "J",
  },
  {
    quote:
      "La fibra anda siempre estable y con Conectar Play miramos todo en el living y en el celular. Cambio total.",
    name: "Sofía R.",
    role: "Cliente hogar",
    initial: "S",
  },
] as const;

const metricBorders = [
  "",
  "border-l border-slate-200",
  "border-t border-slate-200 lg:border-t-0 lg:border-l",
  "border-t border-l border-slate-200 lg:border-t-0",
] as const;

export function HomeSocialProofSection() {
  return (
    <section
      aria-labelledby="home-social-proof-title"
      className="bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-emerald-700 uppercase sm:text-sm">
            Nos elige la región
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#0b2038] text-balance sm:text-4xl lg:text-5xl"
            id="home-social-proof-title"
          >
            Miles de hogares ya están conectados
          </h2>
        </div>

        <dl className="mt-9 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/5 sm:mt-10 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              className={`flex min-h-32 flex-col items-center justify-center px-3 py-6 text-center sm:min-h-36 sm:px-6 ${metricBorders[index]}`}
              key={metric.label}
            >
              <dt className="order-2 mt-2 text-xs leading-5 font-semibold text-slate-600 sm:text-sm">
                {metric.label}
              </dt>
              <dd className="font-display order-1 text-2xl font-bold tracking-[-0.03em] text-[#0b2038] sm:text-3xl">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-5">
          {testimonials.map((testimonial) => (
            <figure
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 sm:p-7 md:last:col-span-2 lg:last:col-span-1"
              key={testimonial.name}
            >
              <div
                aria-label="5 de 5 estrellas"
                className="flex gap-1 text-emerald-600"
                role="img"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <span aria-hidden="true" key={index}>
                    ★
                  </span>
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-7 text-slate-700 sm:text-base">
                <p>“{testimonial.quote}”</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <span
                  aria-hidden="true"
                  className="font-display flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800"
                >
                  {testimonial.initial}
                </span>
                <span>
                  <span className="block text-sm font-bold text-[#0b2038]">
                    {testimonial.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {testimonial.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
