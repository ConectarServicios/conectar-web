const values = [
  {
    number: "01",
    title: "Fibra óptica",
    text: "Conectividad de alta velocidad y estabilidad mediante tecnología de fibra óptica.",
  },
  {
    number: "02",
    title: "Soluciones tecnológicas",
    text: "Infraestructura, soporte, comunicaciones y software para hogares, empresas y organizaciones.",
  },
  {
    number: "03",
    title: "Atención local",
    text: "Un equipo con presencia permanente en Sunchales para acompañar y atender las necesidades de nuestros clientes.",
  },
];

export function InstitutionalSection() {
  return (
    <section className="relative overflow-hidden bg-[#0b2440] py-20 text-white sm:py-28" aria-labelledby="institutional-title">
      <div className="absolute right-0 top-0 size-80 translate-x-1/2 -translate-y-1/2 rounded-full border-[4rem] border-orange-400/10" aria-hidden="true" />
      <div className="public-container relative">
        <div className="max-w-3xl">
          <p className="text-sm font-black tracking-[.18em] text-orange-400 uppercase">Quiénes somos</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-balance sm:text-5xl" id="institutional-title">Tecnología y conectividad desde Sunchales</h2>
          <div className="mt-6 space-y-4 text-lg leading-8 text-slate-300">
            <p>Conectar Servicios es una empresa radicada en Sunchales, Santa Fe, dedicada a brindar servicios de Internet por fibra óptica y soluciones tecnológicas para hogares, empresas y organizaciones.</p>
            <p>Trabajamos con atención local y acompañamiento cercano, incorporando servicios de conectividad, infraestructura, soporte, comunicaciones y software para responder a distintas necesidades.</p>
          </div>
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
