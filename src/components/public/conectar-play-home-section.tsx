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
      className="scroll-mt-24 overflow-hidden bg-white py-20 sm:py-24"
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
              href="/conectar-play"
            >
              Conocer Conectar Play
            </Link>
          </div>
        </div>

        {settings && (
          <ul
            className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Beneficios de Conectar Play"
          >
            <Benefit
              accentClassName="bg-brand-orange"
              description="Cambios de canal sin demoras."
              icon={Gauge}
              iconClassName="bg-brand-orange/10 text-brand-orange"
              title="Zapping instantáneo"
            />
            <Benefit
              accentClassName="bg-brand-coral"
              description="Contenido nacional y señales de tu zona."
              icon={MapPin}
              iconClassName="bg-brand-coral/10 text-brand-coral"
              title="Canales locales y regionales"
            />
            <Benefit
              accentClassName="bg-brand-yellow"
              description="Usalo en varios equipos al mismo tiempo."
              icon={MonitorSmartphone}
              iconClassName="bg-brand-yellow/20 text-brand-navy-deep"
              title={`Hasta ${settings.simultaneous_devices} dispositivos`}
            />
            <Benefit
              accentClassName="bg-brand-navy"
              description="Miralo también desde tu navegador."
              icon={Globe2}
              iconClassName="bg-brand-navy/10 text-brand-navy"
              title="Acceso web"
            />
          </ul>
        )}

        {plans.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <ConectarPlayPlans
              className="contents"
              plans={plans}
            />
          </div>
        )}

        {settings?.onn_enabled && (
          <aside
            className="mt-6 flex flex-col gap-5 rounded-2xl border border-home-border bg-home-surface/70 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between"
            aria-labelledby="home-play-stick-title"
          >
            <div className="max-w-2xl">
              <p className="text-xs font-black tracking-[.16em] text-home-accent-strong uppercase">
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
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-home-accent-strong bg-white px-5 py-2.5 text-sm font-extrabold text-home-accent-strong transition hover:border-home-accent-strong hover:bg-home-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-accent md:self-auto"
              href="/conectar-play#stick"
            >
              Ver opciones del Stick
            </Link>
          </aside>
        )}

        {unavailable && plans.length === 0 && (
          <p className="public-empty-state">
            La información no está disponible temporalmente.
          </p>
        )}
      </div>
    </section>
  );
}

function Benefit({
  accentClassName,
  description,
  icon: Icon,
  iconClassName,
  title,
}: {
  accentClassName: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  title: string;
}) {
  return (
    <li className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${accentClassName}`}
      />
      <span
        className={`grid size-11 place-items-center rounded-xl ${iconClassName}`}
      >
        <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
      </span>
      <h3 className="mt-4 text-base font-black leading-6 text-brand-navy-deep">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </li>
  );
}
