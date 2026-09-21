import { CreditCard, FileText, RefreshCw } from "lucide-react";

type SelfServiceSectionProps = Readonly<{
  href: string;
}>;

const benefits = [
  {
    title: "Pagos online",
    description: "Aboná tu servicio de forma rápida y segura.",
    icon: CreditCard,
  },
  {
    title: "Facturas y cuenta",
    description: "Consultá tu facturación y la información de tu servicio.",
    icon: FileText,
  },
  {
    title: "Débito automático",
    description:
      "Adherite para simplificar el pago de tus próximas facturas.",
    icon: RefreshCw,
  },
] as const;

export function SelfServiceSection({ href }: SelfServiceSectionProps) {
  return (
    <section
      aria-labelledby="self-service-title"
      className="bg-home-surface-soft py-16 sm:py-20 lg:py-24"
    >
      <div className="public-container">
        <div className="relative overflow-hidden rounded-3xl bg-brand-navy-deep px-6 py-8 text-white shadow-xl shadow-slate-950/15 sm:px-10 sm:py-12 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:gap-14 lg:px-14 lg:py-14">
          <div
            aria-hidden="true"
            className="absolute -top-28 -left-24 size-72 rounded-full bg-home-coral/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -right-24 -bottom-36 size-80 rounded-full bg-home-accent/15 blur-3xl"
          />

          <div className="relative max-w-2xl">
            <p className="text-xs font-black tracking-[0.2em] text-orange-300 uppercase sm:text-sm">
              Autogestión
            </p>
            <h2
              className="font-display mt-4 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-balance sm:text-4xl lg:text-5xl"
              id="self-service-title"
            >
              Gestioná tu servicio cuando quieras
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
              Desde Autogestión podés administrar tu cuenta de Conectar de
              forma simple y online. Consultá tus facturas, realizá pagos con
              los medios disponibles y adherite al débito automático, las 24
              horas y desde donde estés.
            </p>
            <a
              className="home-gradient mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl px-6 py-3 text-center font-extrabold text-brand-navy-deep transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300 motion-reduce:transform-none sm:w-fit"
              href={href}
            >
              Ingresar a Autogestión
            </a>
          </div>

          <ul
            aria-label="Beneficios de Autogestión"
            className="relative mt-10 divide-y divide-white/15 border-y border-white/15 lg:mt-0"
          >
            {benefits.map(({ title, description, icon: Icon }) => (
              <li className="flex gap-4 py-5 first:pt-6 last:pb-6 lg:py-6" key={title}>
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-orange-300"
                >
                  <Icon size={21} strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white sm:text-lg">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-300 sm:text-base">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
