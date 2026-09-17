import { ArrowRight, Clock3, Headset, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";

import { isAllowedContactNumber } from "@/lib/validations/contact-information";
import type { ContactInformation } from "@/types/contact-information";

const channelCardClass =
  "group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md";

const darkChannelCardClass =
  "group flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.055] p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.075] sm:p-6";

const channelLinkClass =
  "mt-auto inline-flex min-h-11 items-center self-start rounded-lg pt-6 text-sm font-bold underline-offset-4 transition hover:underline focus-visible:outline-2 focus-visible:outline-offset-4";

type ContactVariant = "default" | "hogar" | "corporativo";

function ChannelIcon({ icon: Icon, variant }: Readonly<{ icon: LucideIcon; variant: ContactVariant }>) {
  const darkClass = variant === "corporativo"
    ? "size-11 bg-corporate-accent/15 text-corporate-accent-soft ring-1 ring-inset ring-corporate-accent/25"
    : "size-11 bg-home-accent/15 text-home-yellow ring-1 ring-inset ring-home-accent/25";

  return (
    <span className={`flex items-center justify-center rounded-xl ${variant === "default" ? "size-12 bg-brand-navy-deep text-white shadow-sm" : darkClass}`}>
      <Icon aria-hidden="true" size={23} strokeWidth={2} />
    </span>
  );
}

function HoursList({ contactVariant, value, variant }: Readonly<{ contactVariant: ContactVariant; value: string; variant: "regular" | "guard" }>) {
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const dark = contactVariant !== "default";
  const valueClass = contactVariant === "corporativo"
    ? "bg-corporate-accent/15 text-corporate-accent-soft ring-1 ring-inset ring-corporate-accent/25"
    : dark
    ? "bg-home-accent/15 text-home-yellow ring-1 ring-inset ring-home-accent/25"
    : variant === "guard"
    ? "bg-orange-100 text-orange-800"
    : "bg-slate-100 text-brand-navy-deep";
  const rowPaddingClass = variant === "guard" ? "py-2.5" : "py-3";
  const rowClass = dark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-600";
  const labelClass = dark ? "text-white" : "text-slate-900";

  return (
    <ul className="mt-4">
      {lines.map((line, index) => {
        const separatorIndex = line.indexOf(":");

        if (separatorIndex === -1) {
          return <li className={`break-words border-b text-sm leading-6 last:border-b-0 sm:text-base ${rowClass} ${rowPaddingClass}`} key={`${line}-${index}`}>{line}</li>;
        }

        const label = line.slice(0, separatorIndex).trim();
        const hours = line.slice(separatorIndex + 1).trim();

        return (
          <li className={`flex min-w-0 flex-col items-start gap-2 border-b last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${rowClass} ${rowPaddingClass}`} key={`${line}-${index}`}>
            <span className={`min-w-0 break-words font-semibold ${labelClass}`}>{label}</span>
            <span className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-sm font-bold ${valueClass}`}>{hours}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function ContactSection({ contact, unavailable, homeCorporativo = false, homeHogar = false }: Readonly<{ contact: ContactInformation | null; unavailable: boolean; homeCorporativo?: boolean; homeHogar?: boolean }>) {
  const whatsapp = contact?.whatsapp && isAllowedContactNumber(contact.whatsapp) ? contact.whatsapp : null;
  const whatsappDigits = whatsapp?.replace(/\D/g, "") ?? "";
  const validPhone = contact?.phone && isAllowedContactNumber(contact.phone) ? contact.phone : null;
  const phoneDigits = validPhone?.replace(/\D/g, "") ?? "";
  const phone = validPhone && phoneDigits !== whatsappDigits ? validPhone : null;
  const mapUrl = contact?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
    : null;
  const variant: ContactVariant = homeCorporativo ? "corporativo" : homeHogar ? "hogar" : "default";
  const dark = variant !== "default";
  const cardClass = dark
    ? `${darkChannelCardClass} ${variant === "corporativo" ? "hover:border-corporate-accent/35" : "hover:border-home-accent/35"}`
    : channelCardClass;
  const cardEyebrowClass = dark ? "text-slate-400" : "text-slate-500";
  const cardValueClass = dark ? "text-white" : "text-slate-950";
  const linkClass = variant === "corporativo"
    ? "text-corporate-accent-soft hover:text-white focus-visible:outline-corporate-accent-soft"
    : variant === "hogar"
    ? "text-home-yellow hover:text-white focus-visible:outline-home-yellow"
    : "text-orange-700 hover:text-orange-800 focus-visible:outline-orange-600";
  const scheduleCardClass = dark
    ? "rounded-2xl border border-white/10 bg-white/[0.055] p-5 sm:p-6"
    : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7";
  const eyebrowClass = variant === "corporativo"
    ? "text-xs font-black uppercase tracking-[0.2em] text-corporate-accent-soft sm:text-sm"
    : variant === "hogar"
    ? "text-xs font-black uppercase tracking-[0.2em] text-home-yellow sm:text-sm"
    : "public-eyebrow";

  return (
    <section className={`scroll-mt-24 ${dark ? "bg-[#06182c] py-16 text-white sm:py-20" : "border-t border-slate-200 bg-slate-50 py-20 sm:py-24"}`} id="contacto" aria-labelledby="contact-title">
      <div className="public-container">
        <div className="text-center">
          <p className={eyebrowClass}>Contacto</p>
          <h2 className={dark ? "mt-3 text-4xl font-black tracking-tight text-white text-balance sm:text-5xl" : "public-heading mt-3"} id="contact-title">Estamos para ayudarte</h2>
          <p className={`mx-auto mt-5 max-w-2xl text-base leading-7 sm:text-lg ${dark ? "text-slate-300" : "text-slate-600"}`}>Elegí el canal que necesites. También contamos con guardia de soporte fuera del horario habitual.</p>
        </div>
        {unavailable ? <p className="public-empty-state" role="status">Los datos de contacto no están disponibles en este momento.</p> : contact ? (
          <div className={`mx-auto max-w-6xl ${dark ? "mt-9 sm:mt-10" : "mt-10"}`}>
            <ul className={`grid list-none sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] ${dark ? "gap-4" : "gap-5"}`}>
              {whatsapp && (
                <li className={cardClass}>
                  <ChannelIcon icon={MessageCircle} variant={variant} />
                  <p className={`${dark ? "mt-5" : "mt-6"} text-xs font-black uppercase tracking-[0.16em] ${cardEyebrowClass}`}>WhatsApp</p>
                  <p className={`mt-2 break-words text-lg font-bold ${cardValueClass}`}>{whatsapp}</p>
                  <a className={`${channelLinkClass} ${dark ? linkClass : "text-whatsapp-strong hover:text-success focus-visible:outline-whatsapp"}`} href={`https://wa.me/${whatsappDigits}`} rel="noreferrer" target="_blank">Escribir por WhatsApp <ArrowRight aria-hidden="true" className="ml-1 size-4" /></a>
                </li>
              )}
              {contact.commercial_email && (
                <li className={cardClass}>
                  <ChannelIcon icon={Mail} variant={variant} />
                  <p className={`${dark ? "mt-5" : "mt-6"} text-xs font-black uppercase tracking-[0.16em] ${cardEyebrowClass}`}>Email comercial</p>
                  <p className={`mt-2 min-w-0 break-words text-[15px] font-bold ${cardValueClass}`}>{contact.commercial_email}</p>
                  <a className={`${channelLinkClass} ${linkClass}`} href={`mailto:${contact.commercial_email}`}>Enviar email <ArrowRight aria-hidden="true" className="ml-1 size-4" /></a>
                </li>
              )}
              {contact.address && mapUrl && (
                <li className={cardClass}>
                  <ChannelIcon icon={MapPin} variant={variant} />
                  <p className={`${dark ? "mt-5" : "mt-6"} text-xs font-black uppercase tracking-[0.16em] ${cardEyebrowClass}`}>Dónde estamos</p>
                  <p className={`mt-2 break-words text-lg font-bold ${cardValueClass}`}>{contact.address}</p>
                  <a className={`${channelLinkClass} ${linkClass}`} href={mapUrl} rel="noreferrer" target="_blank">Cómo llegar <ArrowRight aria-hidden="true" className="ml-1 size-4" /></a>
                </li>
              )}
              {phone && (
                <li className={cardClass}>
                  <ChannelIcon icon={Phone} variant={variant} />
                  <p className={`${dark ? "mt-5" : "mt-6"} text-xs font-black uppercase tracking-[0.16em] ${cardEyebrowClass}`}>Teléfono</p>
                  <p className={`mt-2 break-words text-lg font-bold ${cardValueClass}`}>{phone}</p>
                  <a className={`${channelLinkClass} ${linkClass}`} href={`tel:${phone.replace(/[^\d+]/g, "")}`}>Llamar <ArrowRight aria-hidden="true" className="ml-1 size-4" /></a>
                </li>
              )}
            </ul>

            <div className={`grid items-start md:grid-cols-2 ${dark ? "mt-4 gap-4" : "mt-5 gap-5"}`}>
              <article className={scheduleCardClass}>
                <ChannelIcon icon={Clock3} variant={variant} />
                <p className={`${dark ? "mt-5" : "mt-6"} text-xs font-black uppercase tracking-[0.16em] ${cardEyebrowClass}`}>Atención habitual</p>
                <h3 className={`mt-2 text-xl font-bold ${cardValueClass}`}>Horarios de atención</h3>
                {contact.business_hours && <HoursList contactVariant={variant} value={contact.business_hours} variant="regular" />}
              </article>
              <article className={dark ? scheduleCardClass : "rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm sm:p-7"}>
                <ChannelIcon icon={Headset} variant={variant} />
                <p className={`${dark ? "mt-5 text-slate-400" : "mt-6 text-orange-700"} text-xs font-black uppercase tracking-[0.16em]`}>Fuera del horario habitual</p>
                <h3 className={`mt-2 text-xl font-bold ${cardValueClass}`}>Guardia de soporte</h3>
                {contact.guard_hours && <HoursList contactVariant={variant} value={contact.guard_hours} variant="guard" />}
                {whatsapp && <a className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-whatsapp px-5 py-2.5 text-center font-bold text-brand-navy-deep transition hover:bg-whatsapp-strong hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp" href={`https://wa.me/${whatsappDigits}`} rel="noreferrer" target="_blank">WhatsApp de guardia</a>}
              </article>
            </div>
          </div>
        ) : <p className="public-empty-state">Próximamente vas a poder encontrar aquí todos nuestros canales de contacto.</p>}
      </div>
    </section>
  );
}
