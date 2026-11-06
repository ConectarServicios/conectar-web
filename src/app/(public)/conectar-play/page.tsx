import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";

import Link from "next/link";
import { CalendarDays, CircleAlert, Globe2, Headset, Minus, MonitorSmartphone, Plus, ShoppingBag, Tv, UsersRound } from "lucide-react";

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
  const hasStickRental = Boolean(
    settings &&
      (settings.onn_rental_price != null || settings.onn_rental_two_price != null),
  );

  return (
    <main data-public-page="conectar-play">
      <section className="bg-[#071C31] py-6 text-white sm:py-8">
        <div className="public-container">
          <p className="text-xs font-black tracking-[.18em] text-[#D7E4F2] uppercase">
            Conectar Play
          </p>
          <h1 className="mt-3 text-3xl leading-tight font-black tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
            {settings?.channel_count
              ? `Más de ${settings.channel_count} canales para disfrutar donde quieras.`
              : "Entretenimiento para clientes de Internet Conectar."}
          </h1>
          {settings?.short_description && (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#D7E4F2] sm:text-base sm:leading-7">
              {settings.short_description}
            </p>
          )}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a className="public-button-primary bg-[#FF9954] bg-none text-center text-[#071C31] motion-reduce:transform-none motion-reduce:transition-none" href="#planes-play">
              Ver planes
            </a>
            {webUrl && isExternalPublicUrl(webUrl) && (
              <a
                aria-label="Abrir Conectar Play Web (abre en una pestaña nueva)"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D7E4F2]/40 bg-[#315C88] px-6 py-3 text-center font-bold text-white transition duration-150 hover:brightness-110 motion-safe:hover:-translate-y-px motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D7E4F2]"
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

      <section className="scroll-mt-24 bg-white py-12 sm:py-16" id="planes-play">
        <div className="public-container">
          <p className="public-eyebrow text-[#315C88]">Planes y precios</p>

          <h2 className="public-heading mt-3 text-[#071C31]">Elegí tu experiencia</h2>

          {plansResult.unavailable ? (
            <p className="public-empty-state" role="status">Los planes de Conectar Play no están disponibles temporalmente.</p>
          ) : plans.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <ConectarPlayPlans className="contents" plans={plans} variant="home" />
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
        <section className="bg-[#D7E4F2] py-12 sm:py-16">
          <div className="public-container">
            <p className="public-eyebrow text-[#315C88]">Qué incluye</p>

            <h2 className="public-heading mt-3 text-[#071C31]">Disfrutá Conectar Play</h2>

            <div className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Info
                icon={Tv}
                title="Canales"
                text={`Más de ${settings.channel_count} canales, HBO y HBO Max incluidos. El plan con Pack Fútbol suma ESPN Premium y TNT Sports.`}
              />

              <Info
                icon={UsersRound}
                title="Uso simultáneo"
                text={`Hasta ${settings.simultaneous_devices} dispositivos simultáneos`}
              />

              {settings.compatibility_text && (
                <Info
                  icon={MonitorSmartphone}
                  title="Múltiples pantallas"
                  text={settings.compatibility_text}
                />
              )}

              <Info
                icon={Globe2}
                title="Acceso web"
                text="Podés ver Conectar Play directamente desde tu navegador, sin necesidad de instalar la aplicación."
              />
            </div>
          </div>
        </section>
      )}

      {showsCompatibility && settings && (
        <section className="bg-[#F7F9FC] py-12 sm:py-16" id="compatibilidad">
          <div className="public-container grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="min-w-0">
              <p className="public-eyebrow text-[#315C88]">Compatibilidad</p>
              <h2 className="public-heading mt-3 text-[#071C31]">
                Usalo en dispositivos compatibles
              </h2>
            </div>
            <div className="min-w-0 space-y-4 leading-7 text-slate-600">
              {settings.compatibility_text && (
                <div className="rounded-2xl border border-[#D7E4F2] bg-white p-5 sm:p-6">
                  <MonitorSmartphone aria-hidden="true" className="mb-4 size-7 text-[#315C88]" strokeWidth={1.75} />
                  <p>{settings.compatibility_text}</p>
                </div>
              )}
              {settings.incompatible_tv_text && (
                <div className="rounded-2xl border border-[#315C88]/25 bg-[#EAF2FA] p-5 text-[#071C31] sm:p-6">
                  <CircleAlert aria-hidden="true" className="mb-3 size-6 text-[#315C88]" strokeWidth={1.75} />
                  <p>{settings.incompatible_tv_text}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {settings?.onn_enabled && (
        <section className="scroll-mt-24 bg-[#D7E4F2] py-12 sm:py-16" id="stick">
          <div className="public-container">
            <div className="max-w-3xl">
              <p className="public-eyebrow text-[#315C88]">Stick para Conectar Play</p>
              <h2 className="public-heading mt-3 text-[#071C31]">
                ¿Tu TV no es compatible?
              </h2>
              {settings.onn_description && (
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  {settings.onn_description}
                </p>
              )}
              <p className="mt-4 font-bold leading-7 text-[#071C31]">
                Disponible para clientes de Internet Conectar con servicio
                Conectar Play activo.
              </p>
            </div>
            {(hasStickRental || settings.onn_sale_price != null) && (
              <div className="mt-8 grid min-w-0 gap-5 md:grid-cols-2">
                {hasStickRental && (
                  <div className="flex min-w-0 flex-col rounded-2xl border border-[#B9CCE0] bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center gap-3 border-b border-[#D7E4F2] pb-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#EAF2FA] text-[#315C88]">
                        <CalendarDays aria-hidden="true" className="size-6" strokeWidth={1.75} />
                      </span>
                      <p className="text-xs font-black tracking-[.16em] text-[#315C88] uppercase">Alquiler</p>
                    </div>
                    <div className="mt-5 grid gap-4 min-[390px]:grid-cols-2">
                      {settings.onn_rental_price != null && (
                        <RentalPrice label="1 Stick" value={settings.onn_rental_price} />
                      )}
                      {settings.onn_rental_two_price != null && (
                        <RentalPrice label="2 Sticks" value={settings.onn_rental_two_price} />
                      )}
                    </div>
                    <p className="mt-5 rounded-xl bg-[#EAF2FA] p-3 text-sm leading-6 text-[#24476D]">
                      El Stick alquilado se entrega en comodato.
                    </p>
                  </div>
                )}
                {settings.onn_sale_price != null && (
                  <Price label="Stick Conectar Play" value={settings.onn_sale_price} />
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {packsResult.unavailable ? (
        <section className="bg-[#F7F9FC] py-12"><div className="public-container"><p className="public-empty-state" role="status">Los packs adicionales no están disponibles temporalmente.</p></div></section>
      ) : packsResult.data.length > 0 && (
        <section className="bg-[#F7F9FC] py-12 sm:py-16">
          <div className="public-container">
            <p className="public-eyebrow text-[#315C88]">Packs adicionales</p>
            <h2 className="public-heading mt-3 text-[#071C31]">Sumá más contenido</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {packsResult.data.map((pack) => (
                <article className="flex min-w-0 flex-col rounded-2xl border border-[#D7E4F2] bg-white p-5 shadow-sm sm:p-6" key={pack.id}>
                  <h3 className="text-xl font-black text-[#071C31]">{pack.name}</h3>
                  {pack.description && (
                    <p className="mt-2 leading-7 text-slate-600">{pack.description}</p>
                  )}
                  {pack.price !== null && (
                    <p className="mt-auto pt-4 font-black text-[#315C88]">
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
        <section className="bg-white py-12"><div className="public-container"><p className="public-empty-state" role="status">Las preguntas de Conectar Play no están disponibles temporalmente.</p></div></section>
      ) : faqsResult.data.length > 0 && (
        <section className="bg-white py-12 sm:py-16">
          <div className="public-container max-w-4xl">
            <p className="public-eyebrow text-[#315C88]">Preguntas frecuentes</p>
            <h2 className="public-heading mt-3 text-[#071C31]">Todo lo que necesitás saber</h2>
            <div className="mt-8 space-y-3">
              {faqsResult.data.map((faq) => (
                <details className="group rounded-2xl border border-[#D7E4F2] bg-white shadow-sm" key={faq.id}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-2xl p-5 font-bold text-[#071C31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315C88] sm:p-6 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">{faq.question}</span>
                    <span aria-hidden="true" className="shrink-0 text-[#315C88]">
                      <Plus className="size-6 group-open:hidden" strokeWidth={1.75} />
                      <Minus className="hidden size-6 group-open:block" strokeWidth={1.75} />
                    </span>
                  </summary>
                  <p className="border-t border-[#D7E4F2] px-5 py-5 whitespace-pre-line leading-7 text-slate-600 sm:px-6">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings?.support_text && (
        <section className="bg-[#EAF2FA] py-12 sm:py-16">
          <div className="public-container text-center">
            <Headset aria-hidden="true" className="mx-auto mb-4 size-8 text-[#315C88]" strokeWidth={1.75} />
            <p className="public-eyebrow text-[#315C88]">Soporte</p>
            <h2 className="mt-3 text-3xl font-black text-[#071C31]">¿Necesitás ayuda?</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">{settings.support_text}</p>
            <Link className="public-button-primary mt-6 bg-[#FF9954] bg-none text-center text-[#071C31] motion-reduce:transform-none motion-reduce:transition-none" href="/#contacto">
              Ir a contacto
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

function Info({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-[#315C88]/20 bg-white p-5 shadow-sm transition duration-150 hover:border-[#315C88]/40 hover:shadow-md motion-reduce:transition-none sm:p-6">
      <div className="grid size-11 place-items-center rounded-xl bg-[#EAF2FA] text-[#315C88] ring-1 ring-[#315C88]/15">
        <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
      </div>
      <h3 className="mt-3 text-lg leading-6 font-black text-[#071C31]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
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
    <div className="flex min-w-0 flex-col rounded-2xl border border-[#B9CCE0] bg-white p-5 text-[#071C31] shadow-sm sm:p-6">
      <div className="flex items-center gap-3 border-b border-[#D7E4F2] pb-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#EAF2FA] text-[#315C88]">
          <ShoppingBag aria-hidden="true" className="size-6" strokeWidth={1.75} />
        </span>
        <p className="text-xs font-black tracking-[.16em] text-[#315C88] uppercase">Compra</p>
      </div>
      <div className="mt-5">
        <p className="text-sm leading-6 font-bold text-[#315C88]">{label}</p>
        <p className="mt-1 text-3xl font-black tracking-tight break-words xl:text-4xl">{stickMoney(value)}</p>
        <p className="mt-1 text-sm leading-6 font-semibold text-slate-600">por equipo</p>
      </div>
    </div>
  );
}

function RentalPrice({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0 border-[#D7E4F2] not-first:border-t not-first:pt-4 min-[390px]:not-first:border-t-0 min-[390px]:not-first:border-l min-[390px]:not-first:pt-0 min-[390px]:not-first:pl-4">
      <p className="text-sm leading-6 font-bold text-[#315C88]">{label}</p>
      <p className="mt-1 text-3xl font-black tracking-tight break-words text-[#071C31] xl:text-4xl">
        {stickMoney(value)}
      </p>
      <p className="mt-1 text-sm leading-6 font-semibold text-slate-600">por mes</p>
    </div>
  );
}

const money = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(value);

const stickMoney = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
