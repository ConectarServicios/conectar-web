import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";

import Link from "next/link";
import { Globe2, MonitorSmartphone, Tv, UsersRound } from "lucide-react";

import { ConectarPlayPlans } from "@/components/public/conectar-play-plans";

import {
  getPlayFaqs,
  getPlayPacks,
  getPlayPlans,
  getPlaySettings,
} from "@/lib/supabase/conectar-play";
import { ContextualPromotions } from "@/components/public/contextual-promotions";
import { isExternalPublicUrl, normalizePublicNavigationUrl } from "@/lib/utils/public-navigation-url";

export const metadata: Metadata = {
  title: "Conectar Play | Conectar Servicios",
  description: "Información, planes y compatibilidad de Conectar Play.",
  alternates: { canonical: "/conectar-play" },
};

export default async function ConectarPlayPage() {
  const [settingsResult, plansResult, packsResult, faqsResult] =
    await Promise.all([
      getPlaySettings(),
      getPlayPlans(),
      getPlayPacks(),
      getPlayFaqs(),
    ]);

  const settings = settingsResult.data;
  const plans = plansResult.data;
  const showsCompatibility = Boolean(
    settings && (settings.compatibility_text || settings.incompatible_tv_text),
  );
  const webUrl = settings?.web_url
    ? normalizePublicNavigationUrl(settings.web_url)
    : null;

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-navy-deep py-20 text-white sm:py-28">
        <div
          className="public-grid-pattern absolute inset-0"
          aria-hidden="true"
        />

        <div className="public-container relative">
          <p className="text-sm font-black tracking-[.2em] text-orange-400 uppercase">
            Conectar Play
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-balance sm:text-6xl">
            {settings?.channel_count
              ? `Más de ${settings.channel_count} canales para disfrutar donde quieras.`
              : "Entretenimiento para clientes de Internet Conectar."}
          </h1>

          {settings?.short_description && (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {settings.short_description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <a className="public-button-primary" href="#planes-play">
              Ver planes
            </a>

            {webUrl && isExternalPublicUrl(webUrl) && (
              <a
                aria-label="Abrir Conectar Play Web (abre en una pestaña nueva)"
                className="public-button-secondary-dark"
                href={webUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Abrir Conectar Play Web
              </a>
            )}
          </div>
        </div>
      </section>

      <ContextualPromotions placement="conectar_play" />

      <section className="py-20 sm:py-24" id="planes-play">
        <div className="public-container">
          <p className="public-eyebrow">Planes y precios</p>

          <h2 className="public-heading mt-3">Elegí tu experiencia</h2>

          {plansResult.unavailable ? (
            <p className="public-empty-state" role="status">Los planes de Conectar Play no están disponibles temporalmente.</p>
          ) : plans.length ? (
            <div className="mt-10">
              <ConectarPlayPlans plans={plans} />
            </div>
          ) : (
            <p className="public-empty-state">
              Próximamente vas a encontrar aquí los planes disponibles.
            </p>
          )}
        </div>
      </section>

      {settingsResult.unavailable && (
        <section className="bg-slate-50 py-12"><div className="public-container"><p className="public-empty-state" role="status">La información de Conectar Play no está disponible temporalmente.</p></div></section>
      )}

      {settings && (
        <section className="bg-slate-50 py-20">
          <div className="public-container">
            <p className="public-eyebrow">Qué incluye</p>

            <h2 className="public-heading mt-3">Disfrutá Conectar Play</h2>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Info
                accentClassName="bg-brand-orange"
                icon={Tv}
                iconClassName="bg-brand-orange/10 text-brand-orange"
                title="Canales"
                text={`Más de ${settings.channel_count} canales, HBO y HBO Max incluidos. El plan con Pack Fútbol suma ESPN Premium y TNT Sports.`}
              />

              <Info
                accentClassName="bg-brand-coral"
                icon={UsersRound}
                iconClassName="bg-brand-coral/10 text-brand-coral"
                title="Uso simultáneo"
                text={`Hasta ${settings.simultaneous_devices} dispositivos simultáneos`}
              />

              {settings.compatibility_text && (
                <Info
                  accentClassName="bg-brand-yellow"
                  icon={MonitorSmartphone}
                  iconClassName="bg-brand-yellow/20 text-brand-navy-deep"
                  title="Múltiples pantallas"
                  text={settings.compatibility_text}
                />
              )}

              <Info
                accentClassName="bg-brand-navy"
                icon={Globe2}
                iconClassName="bg-brand-navy/10 text-brand-navy"
                title="Acceso web"
                text="Podés ver Conectar Play directamente desde tu navegador, sin necesidad de instalar la aplicación."
              />
            </div>
          </div>
        </section>
      )}

      {showsCompatibility && settings && (
        <section className="py-20" id="compatibilidad">
          <div className="public-container grid gap-8 lg:grid-cols-2">
            <div>
              <p className="public-eyebrow">Compatibilidad</p>

              <h2 className="public-heading mt-3">
                Usalo en dispositivos compatibles
              </h2>
            </div>

            <div className="space-y-4 text-lg leading-8 text-slate-600">
              {settings.compatibility_text && (
                <p>{settings.compatibility_text}</p>
              )}

              {settings.incompatible_tv_text && (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
                  {settings.incompatible_tv_text}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {settings?.onn_enabled && (
        <section
          className="scroll-mt-24 bg-brand-navy py-20 text-white"
          id="stick"
        >
          <div className="public-container grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:items-center">
            <div>
              <p className="text-xs font-black tracking-[.18em] text-orange-400 uppercase">
                Stick para Conectar Play
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-balance sm:text-5xl">
                ¿Tu TV no es compatible?
              </h2>

              {settings.onn_description && (
                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
                  {settings.onn_description}
                </p>
              )}

              <p className="mt-5 font-bold text-white">
                Disponible para clientes de Internet Conectar con servicio
                Conectar Play activo.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {settings.onn_sale_price !== null && (
                <Price
                  label="Precio de venta"
                  value={settings.onn_sale_price}
                />
              )}

              {settings.onn_rental_price !== null && (
                <div>
                  <Price
                    label="Alquiler mensual"
                    value={settings.onn_rental_price}
                  />

                  <p className="mt-2 text-sm text-slate-300">
                    El Stick alquilado se entrega en comodato.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {packsResult.unavailable ? (
        <section className="bg-slate-50 py-12"><div className="public-container"><p className="public-empty-state" role="status">Los packs adicionales no están disponibles temporalmente.</p></div></section>
      ) : packsResult.data.length > 0 && (
        <section className="bg-slate-50 py-20">
          <div className="public-container">
            <p className="public-eyebrow">Packs adicionales</p>

            <h2 className="public-heading mt-3">Sumá más contenido</h2>

            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {packsResult.data.map((pack) => (
                <article
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                  key={pack.id}
                >
                  <h3 className="text-xl font-black">{pack.name}</h3>

                  {pack.description && (
                    <p className="mt-2 leading-7 text-slate-600">
                      {pack.description}
                    </p>
                  )}

                  {pack.price !== null && (
                    <p className="mt-4 font-black text-brand-navy">
                      {money(pack.price)} / mes
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqsResult.unavailable ? (
        <section className="py-12"><div className="public-container"><p className="public-empty-state" role="status">Las preguntas de Conectar Play no están disponibles temporalmente.</p></div></section>
      ) : faqsResult.data.length > 0 && (
        <section className="py-20">
          <div className="public-container max-w-4xl">
            <p className="public-eyebrow">Preguntas frecuentes</p>

            <h2 className="public-heading mt-3">
              Todo lo que necesitás saber
            </h2>

            <div className="mt-9 space-y-3">
              {faqsResult.data.map((faq) => (
                <details
                  className="group rounded-2xl border border-slate-200 bg-white p-5"
                  key={faq.id}
                >
                  <summary className="cursor-pointer font-bold text-slate-950 focus-visible:outline-2 focus-visible:outline-orange-500">
                    {faq.question}
                  </summary>

                  <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings?.support_text && (
        <section className="bg-brand-navy-deep py-16 text-white">
          <div className="public-container text-center">
            <p className="text-sm font-black tracking-widest text-orange-400 uppercase">
              Soporte
            </p>

            <h2 className="mt-3 text-3xl font-black">
              ¿Necesitás ayuda?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
              {settings.support_text}
            </p>

            <Link
              className="public-button-primary mt-7"
              href="/hogar#contacto"
            >
              Ir a contacto
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

function Info({
  accentClassName,
  icon: Icon,
  iconClassName,
  title,
  text,
}: {
  accentClassName: string;
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  text: string;
}) {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md motion-reduce:transform-none">
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${accentClassName}`}
      />

      <div
        className={`grid size-12 place-items-center rounded-xl ${iconClassName}`}
      >
        <Icon aria-hidden="true" className="size-6" strokeWidth={2} />
      </div>

      <h3 className="mt-5 text-lg font-black text-brand-navy-deep">{title}</h3>

      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </article>
  );
}

function Price({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white p-5 text-slate-950 shadow-lg shadow-slate-950/15">
      <p className="text-sm font-bold text-slate-600">{label}</p>

      <p className="mt-1 text-2xl font-black">{money(value)}</p>
    </div>
  );
}

const money = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(value);
