import {
  Layers3,
  MessagesSquare,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const indicators = [
  { value: "AR", description: "Infraestructura y datos en Argentina" },
  { value: "24/7", description: "Monitoreo gestionado" },
  { value: "Local", description: "Soporte desde Sunchales" },
  { value: "SLA", description: "Tiempos de respuesta acordados" },
] as const;

const trustPrinciples: ReadonlyArray<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Un solo equipo",
    description:
      "Conectividad, infraestructura y seguridad coordinadas desde un mismo proveedor.",
    icon: Layers3,
  },
  {
    title: "Soporte cercano",
    description:
      "Atención técnica con conocimiento del entorno y acompañamiento durante la operación.",
    icon: MessagesSquare,
  },
  {
    title: "Escalabilidad",
    description:
      "Soluciones que pueden ampliarse sin cambiar de proveedor a medida que crecen las necesidades.",
    icon: TrendingUp,
  },
];

export function CorporateTrustSection() {
  return (
    <section
      aria-labelledby="corporate-trust-title"
      className="relative isolate overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 -z-10 h-80 w-80 rounded-full bg-[#2f6bff]/5 blur-3xl"
      />

      <div className="public-container">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#2456d6] uppercase sm:text-sm">
              Nos elige la región
            </p>
            <h2
              className="font-display mt-4 max-w-3xl text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#0b2038] text-balance sm:text-4xl lg:text-5xl"
              id="corporate-trust-title"
            >
              Empresas que confían su IT a Conectar
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-slate-600 lg:justify-self-end lg:text-lg lg:leading-8">
            Acompañamos organizaciones de la región con conectividad,
            infraestructura y soporte gestionado desde un único equipo.
          </p>
        </div>

        <dl className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] min-[420px]:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {indicators.map(({ value, description }, index) => (
            <div
              className={`flex flex-col px-6 py-7 sm:px-7 sm:py-8 lg:px-8 ${
                index > 0 ? "border-t border-slate-200 min-[420px]:border-t-0" : ""
              } ${index % 2 === 1 ? "min-[420px]:border-l" : ""} ${
                index >= 2 ? "min-[420px]:border-t" : ""
              } ${index > 0 ? "lg:border-t-0 lg:border-l" : "lg:border-l-0"}`}
              key={value}
            >
              <dt className="text-sm leading-6 font-medium text-slate-600">
                {description}
              </dt>
              <dd className="font-display -order-1 mb-3 text-3xl font-bold tracking-[-0.04em] text-[#1746bd] sm:text-4xl">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 border-t border-slate-200 pt-12 sm:mt-16 sm:pt-14 lg:grid lg:grid-cols-[minmax(260px,.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-[-0.03em] text-[#0b2038] sm:text-3xl">
              Una relación técnica cercana
            </h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Trabajamos con organizaciones que necesitan respuestas concretas,
              soporte cercano y una infraestructura que pueda crecer junto con
              su operación.
            </p>
          </div>

          <ul className="mt-10 grid list-none gap-0 sm:grid-cols-3 lg:mt-0">
            {trustPrinciples.map(({ title, description, icon: Icon }, index) => (
              <li
                className={`border-t border-slate-200 py-7 first:border-t-0 sm:border-t-0 sm:px-6 sm:py-0 sm:first:pl-0 sm:last:pr-0 ${
                  index > 0 ? "sm:border-l" : ""
                }`}
                key={title}
              >
                <span
                  aria-hidden="true"
                  className="flex size-11 items-center justify-center rounded-full bg-[#e8efff] text-[#2456d6]"
                >
                  <Icon size={21} strokeWidth={1.9} />
                </span>
                <h4 className="font-display mt-5 text-lg font-bold tracking-[-0.02em] text-[#0b2038]">
                  {title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
