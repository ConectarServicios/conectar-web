const capabilities = [
  "Fibra óptica",
  "Infraestructura",
  "Seguridad",
  "Comunicaciones",
  "Software",
  "Atención local",
] as const;

export function InstitutionalSection({ page = false }: Readonly<{ page?: boolean }>) {
  const Heading = page ? "h1" : "h2";

  return (
    <section
      className="relative scroll-mt-20 overflow-hidden bg-[#F7F6F2] py-20 sm:py-28"
      id="quienes-somos"
      aria-labelledby="institutional-title"
    >
      <div
        className="absolute -right-24 top-12 size-64 rounded-full border-[3.5rem] border-orange-400/10"
        aria-hidden="true"
      />

      <div className="public-container relative">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p className="text-sm font-black tracking-[0.18em] text-home-strong uppercase">
              Quiénes somos
            </p>

            <Heading
              className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-brand-navy-deep text-balance sm:text-5xl lg:text-6xl"
              id="institutional-title"
            >
              Tecnología de acá, para conectar lo que importa.
            </Heading>
          </div>

          <div className="flex flex-col justify-end">
            <div className="space-y-5 text-lg leading-8 text-slate-600">
              <p>
                Somos Conectar Servicios, una empresa de Sunchales dedicada a
                brindar conectividad por fibra óptica y soluciones tecnológicas
                para hogares, empresas y organizaciones.
              </p>

              <p>
                Combinamos infraestructura, experiencia técnica y atención local
                para acompañar a nuestros clientes desde la instalación hasta el
                soporte de todos los días.
              </p>
            </div>

            <div className="mt-8 border-l-4 border-home-accent pl-5">
              <p className="font-display text-xl font-bold leading-8 text-brand-navy">
                Presencia local, soluciones integrales y tecnología pensada
                para crecer junto a nuestros clientes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-y border-slate-300/80 py-7">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-between">
            {capabilities.map((capability) => (
              <span
                className="text-sm font-extrabold tracking-wide text-brand-navy"
                key={capability}
              >
                {capability}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] bg-brand-navy-deep text-white shadow-xl shadow-slate-950/10">
          <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
            <div className="relative overflow-hidden border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <div
                className="absolute -bottom-16 -left-16 size-48 rounded-full border-[2.5rem] border-orange-400/15"
                aria-hidden="true"
              />

              <div className="relative">
                <p className="text-xs font-black tracking-[0.18em] text-home-yellow uppercase">
                  Nuestro lugar
                </p>

                <p className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                  Sunchales,
                  <br />
                  Santa Fe.
                </p>
              </div>
            </div>

            <div className="flex items-center p-8 sm:p-10 lg:p-12">
              <div className="max-w-2xl">
                <p className="text-2xl font-bold leading-9 text-balance sm:text-3xl">
                  Desde acá conectamos hogares, empresas y organizaciones de la
                  región.
                </p>

                <p className="mt-5 max-w-xl leading-7 text-slate-300">
                  Crecemos incorporando nuevas soluciones y manteniendo algo que
                  para nosotros sigue siendo fundamental: estar cerca cuando
                  nuestros clientes nos necesitan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
