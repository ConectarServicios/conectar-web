import { Gauge, MapPin, MonitorSmartphone, Tv } from "lucide-react";
import Link from "next/link";

import { ConectarPlayPlans } from "@/components/public/conectar-play-plans";
import type {
  ConectarPlayPlan,
  ConectarPlaySettings,
} from "@/types/conectar-play";

const money = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(value);

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

  const showStick = Boolean(
    settings?.onn_enabled &&
      (settings.onn_description ||
        settings.onn_sale_price !== null ||
        settings.onn_rental_price !== null),
  );

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

        {(plans.length > 0 || showStick) && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <ConectarPlayPlans
              className="contents"
              plans={plans}
              variant="home"
            />

            {showStick && settings && <StickCard settings={settings} />}
          </div>
        )}

        {unavailable && plans.length === 0 && !showStick && (
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

function StickCard({ settings }: { settings: ConectarPlaySettings }) {
  return (
    <article className="flex min-w-0 flex-col rounded-3xl border border-slate-200 bg-[#0b2440] p-6 text-white shadow-sm sm:p-7">
      <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-emerald-300">
        <Tv aria-hidden="true" size={22} strokeWidth={2.25} />
      </span>
      <p className="mt-5 text-xs font-black tracking-[.16em] text-emerald-300 uppercase">
        Stick Conectar Play
      </p>
      <h3 className="mt-2 text-2xl font-black tracking-tight">
        Disfrutá Play en tu TV
      </h3>
      {settings.onn_description && (
        <p className="mt-3 whitespace-pre-line leading-7 text-slate-200">
          {settings.onn_description}
        </p>
      )}
      <div className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
        {settings.onn_sale_price !== null && (
          <StickPrice label="Venta" value={settings.onn_sale_price} />
        )}
        {settings.onn_rental_price !== null && (
          <StickPrice label="Alquiler mensual" value={settings.onn_rental_price} />
        )}
      </div>
      <Link
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-emerald-300/60 bg-emerald-300/10 px-4 py-3 text-center text-sm font-black text-emerald-200 transition hover:border-emerald-200 hover:bg-emerald-300/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
        href="/conectar-play#compatibilidad"
      >
        Ver compatibilidad y condiciones
      </Link>
    </article>
  );
}

function StickPrice({ label, value }: { label: string; value: number }) {
  return (
    <p className="min-w-0 rounded-xl border border-emerald-300/20 bg-white/10 px-4 py-3">
      <span className="block text-xs font-bold tracking-wide text-emerald-200 uppercase">
        {label}
      </span>
      <strong className="mt-1 block break-words text-lg leading-tight font-black text-white">
        {money(Number(value))}
      </strong>
    </p>
  );
}
