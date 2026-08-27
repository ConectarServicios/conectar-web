const values = [
  { number: "01", title: "Conectividad", text: "Opciones pensadas para acompañar tus actividades cotidianas." },
  { number: "02", title: "Atención", text: "Un vínculo cercano para ayudarte a encontrar respuestas." },
  { number: "03", title: "Distintas necesidades", text: "Soluciones para personas, hogares y organizaciones." },
];

export function InstitutionalSection() {
  return (
    <section className="relative overflow-hidden bg-[#0b2440] py-20 text-white sm:py-28" aria-labelledby="institutional-title">
      <div className="absolute right-0 top-0 size-80 translate-x-1/2 -translate-y-1/2 rounded-full border-[4rem] border-orange-400/10" aria-hidden="true" />
      <div className="public-container relative">
        <div className="max-w-3xl">
          <p className="text-sm font-black tracking-[.18em] text-orange-400 uppercase">Quiénes somos</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-balance sm:text-5xl" id="institutional-title">Conectar para estar más cerca</h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">Trabajamos para ofrecer soluciones de conectividad pensadas para personas, hogares y organizaciones.</p>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
          {values.map((value) => (
            <article className="bg-[#0b2440] p-7 sm:p-9" key={value.number}>
              <p className="text-sm font-black text-orange-400" aria-hidden="true">{value.number}</p>
              <h3 className="mt-5 text-xl font-bold">{value.title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{value.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
