import { ArrowRight, Gauge, MapPin, MonitorSmartphone } from "lucide-react";
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
      className="scroll-mt-24 overflow-hidden bg-slate-50 py-20 sm:py-24"
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
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#12b886] px-6 py-3 text-center font-extrabold text-[#03221b] transition hover:-translate-y-0.5 hover:bg-[#18c996] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087f5b] motion-reduce:transform-none sm:w-fit"
              href="/conectar-play"
            >
              Conocer Conectar Play
            </Link>
          </div>
        </div>

        {settings && (
          <ul
            className="mt-8 grid gap-3 sm:grid-cols-3"
            aria-label="Beneficios de Conectar Play"
          >
            <Benefit icon={Gauge} text="Zapping instantáneo" />
            <Benefit icon={MapPin} text="Canales locales y regionales" />
            <Benefit
              icon={MonitorSmartphone}
              text={`Hasta ${settings.simultaneous_devices} dispositivos`}
            />
          </ul>
        )}

        {plans.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <ConectarPlayPlans
              className="contents"
              plans={plans}
              variant="home"
            />
          </div>
        )}

        {settings?.onn_enabled && (
          <aside
            className="mt-6 flex flex-col gap-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between"
            aria-labelledby="home-play-stick-title"
          >
            <div className="max-w-2xl">
              <p className="text-xs font-black tracking-[.16em] text-emerald-700 uppercase">
                Stick Conectar Play
              </p>
              <h3
                className="mt-1.5 text-xl font-black text-[#0b2440]"
                id="home-play-stick-title"
              >
                ¿Tu TV no es compatible?
              </h3>
              <p className="mt-2 leading-7 text-slate-600">
                También podés disfrutar Conectar Play con nuestro Stick.
              </p>
            </div>

            <Link
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-emerald-600 bg-white px-5 py-2.5 text-sm font-extrabold text-emerald-800 transition hover:border-emerald-700 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 md:self-auto"
              href="/conectar-play#stick"
            >
              Ver opciones del Stick
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2.5} />
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
  icon: Icon,
  text,
}: {
  icon: typeof Gauge;
  text: string;
}) {
  return (
    <li className="flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-sm font-bold text-[#0b2440] shadow-sm sm:px-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon aria-hidden="true" size={20} strokeWidth={2.25} />
      </span>
      <span>{text}</span>
    </li>
  );
}
