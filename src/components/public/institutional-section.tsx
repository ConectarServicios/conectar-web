import { Binary, Cable, Headset, MapPin, Network, Phone, ServerCog, ShieldCheck } from "lucide-react";

const capabilities = [
  { title: "Fibra óptica", icon: Cable },
  { title: "Infraestructura", icon: ServerCog },
  { title: "Seguridad", icon: ShieldCheck },
  { title: "Comunicaciones", icon: Phone },
  { title: "Software", icon: Binary },
  { title: "Atención local", icon: Headset },
] as const;

const highlights = [
  { title: "Presencia local", icon: MapPin },
  { title: "Soluciones integrales", icon: Network },
  { title: "Acompañamiento", icon: Headset },
] as const;

export function InstitutionalSection({ page = false }: Readonly<{ page?: boolean }>) {
  const Heading = page ? "h1" : "h2";

  return (
    <div className="scroll-mt-20" id="quienes-somos">
      <section className="bg-[#071C31] py-8 text-white sm:py-10" aria-labelledby="institutional-title">
        <div className="public-container">
          <p className="text-xs font-black tracking-[.18em] text-[#FFAD52] uppercase">Conocé Conectar Servicios</p>
          <Heading className="mt-3 max-w-5xl text-3xl leading-tight font-black tracking-tight text-balance sm:text-4xl" id="institutional-title">
            Tecnología de acá, para conectar lo que importa.
          </Heading>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[#D7E4F2] sm:text-base sm:leading-7">
            Somos Conectar Servicios, una empresa de Sunchales dedicada a
            brindar conectividad por fibra óptica y soluciones tecnológicas
            para hogares, empresas y organizaciones.
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#D7E4F2]">
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-[#FFAD52]" strokeWidth={1.75} />
            Sunchales, Santa Fe
          </p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16" aria-labelledby="institutional-overview-title">
        <div className="public-container">
          <h2 className="public-heading max-w-3xl text-[#071C31]" id="institutional-overview-title">Tecnología y cercanía en cada solución</h2>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-12">
            <div className="min-w-0">
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                Combinamos infraestructura, experiencia técnica y atención local
                para acompañar a nuestros clientes desde la instalación hasta el
                soporte de todos los días.
              </p>
              <p className="mt-6 border-l-4 border-home-accent pl-5 text-lg leading-8 font-bold text-[#071C31] sm:text-xl">
                Presencia local, soluciones integrales y tecnología pensada
                para crecer junto a nuestros clientes.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1" aria-label="Características de Conectar Servicios">
              {highlights.map(({ title, icon: Icon }) => (
                <li className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#D7E4F2] bg-[#F7F9FC] p-4" key={title}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EAF2FA] text-[#315C88]">
                    <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-base leading-6 font-bold text-[#071C31]">{title}</h3>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#EAF2FA] py-12 sm:py-16" aria-labelledby="institutional-capabilities-title">
        <div className="public-container">
          <h2 className="public-heading max-sm:text-3xl text-[#071C31]" id="institutional-capabilities-title">Nuestras especialidades</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ title, icon: Icon }) => (
              <li className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#B9CCE0] bg-white p-5 shadow-sm" key={title}>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#EAF2FA] text-[#315C88]">
                  <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
                </span>
                <h3 className="text-base leading-6 font-bold text-[#071C31] sm:text-lg">{title}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#F7F9FC] py-12 sm:py-16" aria-labelledby="institutional-location-title">
        <div className="public-container">
          <div className="relative isolate overflow-hidden rounded-3xl border border-[#315C88]/30 bg-[#071C31] p-6 text-white shadow-sm sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -top-16 -right-16 -z-10 size-56 rounded-full border-[1.5rem] border-[#FFAD52]/10" aria-hidden="true" />
            <div className="grid gap-7 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] lg:items-center lg:gap-12">
              <div className="min-w-0">
                <MapPin aria-hidden="true" className="mb-4 size-7 text-[#FFAD52]" strokeWidth={1.75} />
                <p className="text-xs font-black tracking-[.18em] text-[#FFAD52] uppercase">Nuestro lugar</p>
                <h2 className="mt-3 text-3xl leading-tight font-black tracking-tight sm:text-4xl" id="institutional-location-title">Sunchales, Santa Fe.</h2>
              </div>
              <div className="min-w-0">
                <p className="text-2xl leading-9 font-bold text-balance sm:text-3xl">
                  Desde acá conectamos hogares, empresas y organizaciones de la
                  región.
                </p>
                <p className="mt-5 max-w-2xl leading-7 text-[#D7E4F2]">
                  Crecemos incorporando nuevas soluciones y manteniendo algo que
                  para nosotros sigue siendo fundamental: estar cerca cuando
                  nuestros clientes nos necesitan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
