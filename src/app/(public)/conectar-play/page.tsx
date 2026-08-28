import type { Metadata } from "next";

import Link from "next/link";

import { ConectarPlayPlans } from "@/components/public/conectar-play-plans";

import {
  getPlayFaqs,
  getPlayPacks,
  getPlayPlans,
  getPlaySettings,
} from "@/lib/supabase/conectar-play";

export const metadata: Metadata = {
  title: "Conectar Play | Conectar Servicios",
  description: "Información, planes y compatibilidad de Conectar Play.",
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

  return (
    <main>
      <section className="relative overflow-hidden bg-[#071a2f] py-20 text-white sm:py-28">
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

            <a
              className="public-button-secondary-dark"
              href="#compatibilidad"
            >
              Compatibilidad
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24" id="planes-play">
        <div className="public-container">
          <p className="public-eyebrow">Planes y precios</p>

          <h2 className="public-heading mt-3">Elegí tu experiencia</h2>

          {plans.length ? (
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

      {settings && (
        <section className="bg-slate-50 py-20">
          <div className="public-container">
            <p className="public-eyebrow">Qué incluye</p>

            <h2 className="public-heading mt-3">Disfrutá Conectar Play</h2>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Info
                title="Canales"
                text={`Más de ${settings.channel_count} canales, HBO y HBO Max incluidos. El plan con Pack Fútbol suma ESPN Premium y TNT Sports.`}
              />

              <Info
                title="Uso simultáneo"
                text={`Hasta ${settings.simultaneous_devices} dispositivos simultáneos`}
              />

              {settings.compatibility_text && (
                <Info
                  title="Múltiples pantallas"
                  text={settings.compatibility_text}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {settings &&
        (settings.compatibility_text || settings.incompatible_tv_text) && (
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

      {settings?.web_url && (
        <section className="bg-white py-12">
          <div className="public-container">
            <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
              <div className="max-w-2xl">
                <p className="public-eyebrow">Acceso web</p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  También podés verlo desde tu navegador
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Accedé a Conectar Play directamente desde una computadora o
                  dispositivo compatible, sin necesidad de instalar la
                  aplicación.
                </p>
              </div>

              <a
                className="public-button-primary shrink-0"
                href={settings.web_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Abrir Conectar Play Web
              </a>
            </div>
          </div>
        </section>
      )}

      {settings?.onn_enabled && (
        <section className="bg-[#0b2440] py-20 text-white">
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

      {packsResult.data.length > 0 && (
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
                    <p className="mt-4 font-black text-[#0b2440]">
                      {money(pack.price)} / mes
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqsResult.data.length > 0 && (
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
        <section className="bg-[#071a2f] py-16 text-white">
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
              href="/#contacto"
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
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-black text-slate-950">{title}</h3>

      <p className="mt-2 leading-7 text-slate-600">{text}</p>
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