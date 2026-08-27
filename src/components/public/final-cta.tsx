export function FinalCta() {
  return (
    <section className="bg-slate-50 py-20 sm:py-24" aria-labelledby="final-cta-title">
      <div className="public-container">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-orange-500 px-6 py-14 text-center text-white shadow-xl shadow-orange-950/15 sm:px-12 sm:py-16">
          <div className="absolute -left-24 -top-24 -z-10 size-72 rounded-full border-[3rem] border-white/10" aria-hidden="true" />
          <div className="absolute -bottom-28 -right-20 -z-10 size-64 rounded-full bg-[#0b2440]/10" aria-hidden="true" />
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight text-balance sm:text-5xl" id="final-cta-title">¿Querés encontrar una opción para vos?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-orange-50">Conocé nuestros planes y servicios disponibles.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#071a2f] px-6 py-3 font-bold text-white transition hover:bg-[#0b2b4d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#planes">Ver planes</a>
            <a className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/60 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#servicios">Ver servicios</a>
          </div>
        </div>
      </div>
    </section>
  );
}
