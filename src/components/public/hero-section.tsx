export function HeroSection() {
  return (
    <section
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#071a2f] text-white"
      id="inicio"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 -z-10 opacity-70" aria-hidden="true">
        <div className="absolute -right-36 -top-36 size-[32rem] rounded-full border-[5rem] border-cyan-400/10" />
        <div className="absolute -bottom-64 left-1/3 size-[34rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="public-grid-pattern absolute inset-0" />
      </div>
      <div className="public-container grid min-h-[650px] items-center gap-14 py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm font-bold text-orange-300">
            <span className="size-2 rounded-full bg-orange-400" aria-hidden="true" />
            Conectividad para cada proyecto
          </p>
          <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-7xl" id="hero-title">
            Internet que te conecta con <span className="text-orange-400">lo que importa</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Conectividad para tu hogar y tus proyectos con el respaldo de
            Conectar Servicios.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="public-button-primary" href="#planes">Ver planes <span aria-hidden="true">↓</span></a>
            <a className="public-button-secondary-dark" href="#servicios">Conocer servicios</a>
          </div>
        </div>
        <div className="relative mx-auto hidden aspect-square w-full max-w-md lg:block" aria-hidden="true">
          <div className="absolute inset-[12%] rounded-full border border-cyan-300/30" />
          <div className="absolute inset-[25%] rounded-full border border-orange-300/40" />
          <div className="absolute inset-[38%] rounded-full bg-orange-500 shadow-[0_0_80px_rgba(249,115,22,.55)]" />
          <span className="absolute left-[13%] top-1/2 size-4 rounded-full bg-cyan-300 shadow-[0_0_25px_rgba(103,232,249,.8)]" />
          <span className="absolute right-[21%] top-[18%] size-3 rounded-full bg-orange-300" />
          <span className="absolute bottom-[19%] right-[21%] size-5 rounded-full border-4 border-blue-300" />
          <div className="absolute left-0 top-[24%] rounded-2xl border border-white/10 bg-white/10 px-5 py-4 shadow-2xl backdrop-blur">
            <p className="text-xs font-bold tracking-widest text-cyan-300 uppercase">Conectar</p>
            <p className="mt-1 font-semibold">Personas y proyectos</p>
          </div>
        </div>
      </div>
    </section>
  );
}
