import { Gauge, Globe2, MapPin, MonitorSmartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { ConectarPlayPlans } from "@/components/public/conectar-play-plans";
import type {
  ConectarPlayPlan,
  ConectarPlaySettings,
} from "@/types/conectar-play";

export function ConectarPlayHomeSection({
  settings,
  plans,
  unavailable,
}: {
  settings: ConectarPlaySettings | null;
  plans: ConectarPlayPlan[];
  unavailable: boolean;
}) {
  if (!settings && plans.length === 0 && !unavailable) return null;

  return (
    <section
      className="scroll-mt-24 overflow-hidden bg-[linear-gradient(135deg,#EAF2FA_0%,#D7E4F2_100%)] py-16 sm:py-20"
      id="conectar-play"
      aria-labelledby="home-play-title"
    >
      <div className="public-container">
        <div className="max-w-4xl">
          <div className="min-w-0">
            <p className="public-eyebrow">Conectar Play</p>
            <h2 className="public-heading mt-3" id="home-play-title">
              {settings?.channel_count
                ? `Más de ${settings.channel_count} canales, sin esperas`
                : "Más entretenimiento, sin esperas"}
            </h2>
            {settings?.short_description && (
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                {settings.short_description}
              </p>
            )}

            <Link
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl home-gradient px-6 py-3 text-center font-extrabold text-[#03221b] transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-accent motion-reduce:transform-none sm:w-fit"
              data-home-action="secondary"
              href="/conectar-play"
            >
              Conocer Conectar Play
            </Link>
          </div>
        </div>

        {settings && (
          <ul
            className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Beneficios de Conectar Play"
          >
            <Benefit
              description="Cambios de canal sin demoras."
              icon={Gauge}
              title="Zapping instantáneo"
            />
            <Benefit
              description="Contenido nacional y señales de tu zona."
              icon={MapPin}
              title="Canales locales y regionales"
            />
            <Benefit
              description="Usalo en varios equipos al mismo tiempo."
              icon={MonitorSmartphone}
              title={`Hasta ${settings.simultaneous_devices} dispositivos`}
            />
            <Benefit
              description="Miralo también desde tu navegador."
              icon={Globe2}
              title="Acceso web"
            />
          </ul>
        )}

        {plans.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <ConectarPlayPlans
              className="contents"
              plans={plans}
              variant="home"
            />
          </div>
        )}

        {settings?.onn_enabled && (
          <aside
            className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#B9CCE0] bg-[#EDF3FA] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between"
            aria-labelledby="home-play-stick-title"
          >
            <div className="max-w-2xl">
              <p className="text-xs font-black tracking-[.16em] text-brand-navy uppercase">
                Stick Conectar Play
              </p>
              <h3
                className="mt-1.5 text-xl font-black text-brand-navy"
                id="home-play-stick-title"
              >
                ¿Tu TV no es compatible?
              </h3>
              <p className="mt-2 leading-7 text-slate-600">
                También podés disfrutar Conectar Play con nuestro Stick.
              </p>
            </div>

            <Link
              className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-[#6E95BC]/60 bg-[linear-gradient(135deg,#315C88_0%,#183A62_100%)] px-5 py-3 text-center text-sm font-bold text-white transition duration-150 hover:border-[#6E95BC] hover:brightness-105 motion-safe:hover:-translate-y-px motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-navy sm:w-fit md:self-auto"
              href="/conectar-play#stick"
            >
              Ver opciones del Stick
            </Link>
          </aside>
        )}

        {unavailable && plans.length === 0 && (
          <p className="public-empty-state mt-8 p-5 sm:p-6">
            La información no está disponible temporalmente.
          </p>
        )}
      </div>
    </section>
  );
}

function Benefit({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <li className="min-w-0 rounded-2xl border border-[#B9CCE0] bg-white p-4 shadow-sm sm:p-5">
      <span className="grid size-11 place-items-center rounded-xl bg-[#EDF3FA] text-[#315C88] ring-1 ring-[#B9CCE0]/60">
        <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
      </span>
      <h3 className="mt-3 text-base font-black leading-6 text-brand-navy-deep sm:min-h-12">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </li>
  );
}
