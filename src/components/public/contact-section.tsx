import { Clock3, Headset, Mail, MapPin, Phone } from "lucide-react";

import { WhatsAppIcon } from "@/components/public/whatsapp-icon";
import { isAllowedContactNumber } from "@/lib/validations/contact-information";
import type { ContactInformation } from "@/types/contact-information";

type ContactVariant = "default" | "hogar" | "corporativo";

function HoursList({ value, dark }: Readonly<{ value: string; dark: boolean }>) {
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  return (
    <ul className={`mt-3 space-y-1 text-sm leading-6 ${dark ? "text-slate-300" : "text-slate-600"}`}>
      {lines.map((line, index) => <li className="break-words" key={`${line}-${index}`}>{line}</li>)}
    </ul>
  );
}

export function ContactSection({ contact, unavailable, homeCorporativo = false, homeHogar = false }: Readonly<{ contact: ContactInformation | null; unavailable: boolean; homeCorporativo?: boolean; homeHogar?: boolean }>) {
  const whatsapp = contact?.whatsapp && isAllowedContactNumber(contact.whatsapp) ? contact.whatsapp : null;
  const whatsappDigits = whatsapp?.replace(/\D/g, "") ?? "";
  const validPhone = contact?.phone && isAllowedContactNumber(contact.phone) ? contact.phone : null;
  const phoneDigits = validPhone?.replace(/\D/g, "") ?? "";
  const phone = validPhone && phoneDigits !== whatsappDigits ? validPhone : null;
  const mapUrl = contact?.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}` : null;
  const variant: ContactVariant = homeCorporativo ? "corporativo" : homeHogar ? "hogar" : "default";
  const dark = variant !== "default";
  const accent = variant === "corporativo" ? "text-corporate-accent-soft" : variant === "hogar" ? "text-home-yellow" : "public-eyebrow";
  const focusAccent = variant === "corporativo" ? "focus-visible:outline-corporate-accent-soft" : variant === "hogar" ? "focus-visible:outline-home-yellow" : "focus-visible:outline-home-accent";
  const surface = dark ? "border-white/10 bg-white/[0.055]" : "border-slate-200 bg-white shadow-sm";
  const muted = dark ? "text-slate-300" : "text-slate-600";
  const heading = dark ? "text-white" : "text-slate-950";
  const guardNote = variant === "corporativo"
    ? "border-corporate-accent/40 bg-corporate-accent/12 text-[#9bb7ff]"
    : variant === "hogar"
      ? "border-home-accent/40 bg-home-accent/10 text-home-yellow"
      : "border-orange-200 bg-orange-50 text-orange-800";

  return (
    <section className={`scroll-mt-24 ${dark ? "bg-[#06182c] py-14 text-white sm:py-18" : "border-t border-slate-200 bg-slate-50 py-16 sm:py-20"}`} id="contacto" aria-labelledby="contact-title">
      <div className="public-container min-w-0">
        <div className="min-w-0 max-w-3xl">
          <p className={accent}>Contacto</p>
          <h2 className={`mt-3 text-3xl font-black tracking-tight text-balance sm:text-5xl ${heading}`} id="contact-title">¿Necesitás ayuda o querés contratar?</h2>
          <p className={`mt-4 max-w-2xl text-base leading-7 sm:text-lg ${muted}`}>Te atendemos de forma directa, con la cercanía de siempre.</p>
        </div>

        {unavailable ? <p className="public-empty-state" role="status">Los datos de contacto no están disponibles en este momento.</p> : contact ? (
          <div className={`mt-8 box-border w-full min-w-0 max-w-full overflow-hidden rounded-3xl border ${surface}`}>
            <div className="grid w-full min-w-0 max-w-full gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:p-9">
              <div className="min-w-0 max-w-full">
                <div className="flex min-w-0 max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {whatsapp && (
                    <a className="inline-flex min-h-12 w-full min-w-0 max-w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-center font-extrabold text-brand-navy-deep transition hover:bg-whatsapp-strong hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-whatsapp sm:w-auto sm:px-5" href={`https://wa.me/${whatsappDigits}`} rel="noopener noreferrer" target="_blank">
                      <span className="shrink-0"><WhatsAppIcon /></span> <span className="min-w-0">Hablar por WhatsApp</span>
                    </a>
                  )}
                  {phone && (
                    <a className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 py-3 font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 ${focusAccent} ${dark ? "border-white/20 bg-white/[0.04] text-white hover:bg-white/10" : "border-slate-300 text-brand-navy-deep hover:border-slate-400 hover:bg-slate-50"}`} href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
                      <Phone className="size-4" aria-hidden="true" /> Llamar
                    </a>
                  )}
                </div>

                <dl className={`mt-7 flex flex-col gap-5 border-t pt-6 ${dark ? "border-white/10" : "border-slate-200"}`}>
                  {contact.commercial_email && (
                    <div className="min-w-0">
                      <dt className={`flex items-center gap-2 text-xs font-black tracking-[0.14em] uppercase ${dark ? "text-slate-400" : "text-slate-500"}`}><Mail className="size-4" aria-hidden="true" /> Email comercial</dt>
                      <dd className="mt-2 min-w-0 max-w-full"><a className={`block max-w-full [overflow-wrap:anywhere] font-bold underline-offset-4 hover:underline ${dark ? "text-white" : "text-brand-navy-deep"} ${focusAccent}`} href={`mailto:${contact.commercial_email}`}>{contact.commercial_email}</a></dd>
                    </div>
                  )}
                  {contact.address && mapUrl && (
                    <div className="min-w-0">
                      <dt className={`flex items-center gap-2 text-xs font-black tracking-[0.14em] uppercase ${dark ? "text-slate-400" : "text-slate-500"}`}><MapPin className="size-4" aria-hidden="true" /> Dirección</dt>
                      <dd className="mt-2"><a className={`break-words font-bold underline-offset-4 hover:underline ${dark ? "text-white" : "text-brand-navy-deep"} ${focusAccent}`} href={mapUrl} rel="noopener noreferrer" target="_blank">{contact.address}</a></dd>
                    </div>
                  )}
                </dl>
              </div>

              {(contact.business_hours || contact.guard_hours) && (
                <div className={`min-w-0 max-w-full divide-y rounded-2xl border ${dark ? "divide-white/10 border-white/10 bg-black/10" : "divide-slate-200 border-slate-200 bg-slate-50"}`}>
                  {contact.business_hours && (
                    <div className="min-w-0 p-5 sm:p-6">
                      <h3 className={`flex items-center gap-2 font-bold ${heading}`}><Clock3 className={`size-5 ${accent}`} aria-hidden="true" /> Atención habitual</h3>
                      <HoursList dark={dark} value={contact.business_hours} />
                    </div>
                  )}
                  {contact.guard_hours && (
                    <div className="min-w-0 p-5 sm:p-6">
                      <h3 className={`flex items-center gap-2 font-bold ${heading}`}><Headset className={`size-5 ${accent}`} aria-hidden="true" /> Guardia de soporte</h3>
                      <HoursList dark={dark} value={contact.guard_hours} />
                      <p className={`mt-3 inline-flex w-full min-w-0 max-w-full rounded-full border px-3 py-2 text-sm leading-5 font-semibold sm:w-auto sm:px-4 ${guardNote}`}>Durante la guardia podés comunicarte al mismo número habitual.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : <p className="public-empty-state">Próximamente vas a poder encontrar aquí todos nuestros canales de contacto.</p>}
      </div>
    </section>
  );
}
