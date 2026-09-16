const commitments = [
  { value: "24/7", label: "Monitoreo de infraestructura" },
  { value: "Local", label: "Soporte en Sunchales" },
  { value: "AR", label: "Tus datos en Argentina" },
  { value: "SLA", label: "Tiempos de respuesta acordados" },
] as const;

export function CorporateCommitmentsSection() {
  return (
    <section
      aria-labelledby="corporate-commitments-title"
      className="relative isolate overflow-hidden bg-[#071a2f] py-20 text-white sm:py-24 lg:py-28"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="public-grid-pattern absolute inset-0 opacity-35" />
        <div className="absolute -bottom-48 left-1/3 size-96 rounded-full bg-[#2f6bff]/10 blur-3xl" />
      </div>
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-[#7fa2ff] uppercase sm:text-sm">Nuestros compromisos</p>
          <h2
            className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-balance sm:text-4xl lg:text-5xl"
            id="corporate-commitments-title"
          >
            Lo que podés esperar de nosotros
          </h2>
        </div>

        <dl className="mt-10 grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {commitments.map((commitment) => (
            <div className="border-white/10 p-6 not-last:border-b sm:p-7 sm:odd:border-r sm:nth-[2]:border-r-0 sm:nth-[3]:border-b-0 lg:not-last:border-r lg:not-last:border-b-0" key={commitment.value}>
              <dt className="font-display text-3xl font-bold tracking-[-0.04em] text-[#8eabff] sm:text-4xl">{commitment.value}</dt>
              <dd className="mt-3 text-sm leading-6 text-[#b8c9d9]">{commitment.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
