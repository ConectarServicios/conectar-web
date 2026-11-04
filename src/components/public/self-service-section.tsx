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
      className="bg-[#EAF2FA] py-16 sm:py-20"
    >
      <div className="public-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-[#315C88] uppercase sm:text-sm">
            Autogestión
          </p>
          <h2
            className="font-display mt-3 text-3xl leading-[1.12] font-bold tracking-[-0.035em] text-[#071C31] text-balance sm:text-4xl lg:text-4xl"
            id="self-service-title"
          >
            Gestioná tu servicio cuando quieras
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg sm:leading-7">
            Desde Autogestión podés administrar tu cuenta de Conectar de
            forma simple y online. Consultá tus facturas, realizá pagos con
            los medios disponibles y adherite al débito automático, las 24
            horas y desde donde estés.
          </p>
          <a
            className="home-gradient mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl px-6 py-3 text-center font-extrabold text-brand-navy-deep transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#315C88] motion-reduce:transform-none sm:w-fit"
            href={href}
          >
            Ingresar a Autogestión
          </a>
        </div>

        <ul
          aria-label="Beneficios de Autogestión"
          className="mt-8 grid auto-rows-fr gap-4 md:grid-cols-3"
        >
          {benefits.map(({ title, description, icon: Icon }) => (
            <li className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#D7E4F2] bg-white p-4 shadow-sm sm:p-5" key={title}>
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EAF2FA] text-[#315C88]"
              >
                <Icon className="size-6" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-base font-bold text-[#071C31] sm:text-lg">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
