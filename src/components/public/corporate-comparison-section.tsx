import { Check } from "lucide-react";

const comparisonRows = [
  {
    topic: "Atención",
    traditional: "Mesa remota, con demoras",
    conectar: "Local, en Sunchales, con guardia",
  },
  {
    topic: "Alcance",
    traditional: "Solo conectividad o solo servidores",
    conectar: "Conectividad + infraestructura + seguridad",
  },
  {
    topic: "Tus datos",
    traditional: "Alojados en el exterior",
    conectar: "En Argentina, control total",
  },
  {
    topic: "Contratación",
    traditional: "Rígida, cambiás de proveedor para crecer",
    conectar: "Escalás sin cambiar de proveedor",
  },
  {
    topic: "Tráfico",
    traditional: "Facturación por tráfico consumido",
    conectar: "Sin cargo por tráfico",
  },
  {
    topic: "Ampliar recursos",
    traditional: "Cada aumento se cotiza y demora",
    conectar: "Ampliás cuando lo necesitás, sin costo inmediato",
  },
  {
    topic: "Experiencia web",
    traditional: "Sitios y trámites anticuados",
    conectar: "Autogestión online y respuesta directa",
  },
] as const;

function ConectarValue({ children }: Readonly<{ children: string }>) {
  return (
    <span className="flex items-start gap-3 font-semibold text-[#123b9e]">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-corporate-accent text-white"
      >
        <Check size={12} strokeWidth={3} />
      </span>
      <span>{children}</span>
    </span>
  );
}

export function CorporateComparisonSection() {
  return (
    <section
      aria-labelledby="corporate-comparison-title"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-corporate-accent-strong uppercase sm:text-sm">
            Por qué elegirnos
          </p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-brand-navy text-balance sm:text-4xl lg:text-5xl"
            id="corporate-comparison-title"
          >
            Conectar vs. el proveedor tradicional
          </h2>
        </div>

        <div className="mt-10 hidden overflow-hidden rounded-3xl border border-slate-200 shadow-[0_20px_55px_rgba(15,23,42,0.08)] md:block lg:mt-14">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">
              Comparación entre un proveedor tradicional y Conectar Servicios
            </caption>
            <thead className="bg-brand-navy-deep text-white">
              <tr>
                <th className="w-[22%] px-6 py-5 text-sm font-bold" scope="col">Tema</th>
                <th className="w-[36%] px-6 py-5 text-sm font-bold" scope="col">Proveedor tradicional</th>
                <th className="bg-corporate-accent-strong px-6 py-5 text-sm font-bold" scope="col">Conectar Servicios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {comparisonRows.map((row) => (
                <tr className="bg-white" key={row.topic}>
                  <th className="px-6 py-5 text-sm font-bold text-brand-navy" scope="row">{row.topic}</th>
                  <td className="px-6 py-5 text-sm leading-6 text-slate-600">{row.traditional}</td>
                  <td className="border-l border-corporate-accent/15 bg-corporate-accent/[0.055] px-6 py-5 text-sm leading-6">
                    <ConectarValue>{row.conectar}</ConectarValue>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-4 md:hidden">
          {comparisonRows.map((row) => (
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" key={row.topic}>
              <h3 className="bg-brand-navy-deep px-5 py-3 text-sm font-bold text-white">{row.topic}</h3>
              <dl>
                <div className="px-5 py-4">
                  <dt className="text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">Proveedor tradicional</dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-600">{row.traditional}</dd>
                </div>
                <div className="border-t border-corporate-accent/15 bg-corporate-accent/[0.06] px-5 py-4">
                  <dt className="mb-2 text-xs font-bold tracking-[0.12em] text-corporate-accent-strong uppercase">Conectar Servicios</dt>
                  <dd className="text-sm leading-6"><ConectarValue>{row.conectar}</ConectarValue></dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
