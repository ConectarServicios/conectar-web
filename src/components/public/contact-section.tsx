import { ArrowRight, Clock3, Headset, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";

import { isAllowedContactNumber } from "@/lib/validations/contact-information";
import type { ContactInformation } from "@/types/contact-information";

const channelCardClass =
  "group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md";

const channelLinkClass =
  "mt-auto inline-flex min-h-11 items-center self-start rounded-lg pt-6 text-sm font-bold text-orange-700 underline-offset-4 transition hover:text-orange-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600";

function ChannelIcon({ icon: Icon }: Readonly<{ icon: LucideIcon }>) {
  return (
    <span className="flex size-12 items-center justify-center rounded-xl bg-[#071a2f] text-white shadow-sm">
      <Icon aria-hidden="true" size={23} strokeWidth={2} />
    </span>
  );
}

function Hours({ value }: Readonly<{ value: string }>) {
  return <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">{value}</p>;
}

export function ContactSection({ contact, unavailable }: Readonly<{ contact: ContactInformation | null; unavailable: boolean }>) {
  const whatsapp = contact?.whatsapp && isAllowedContactNumber(contact.whatsapp) ? contact.whatsapp : null;
  const whatsappDigits = whatsapp?.replace(/\D/g, "") ?? "";
  const validPhone = contact?.phone && isAllowedContactNumber(contact.phone) ? contact.phone : null;
  const phoneDigits = validPhone?.replace(/\D/g, "") ?? "";
  const phone = validPhone && phoneDigits !== whatsappDigits ? validPhone : null;
  const mapUrl = contact?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
    : null;

  return (
    <section className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-20 sm:py-24" id="contacto" aria-labelledby="contact-title">
      <div className="public-container">
        <div className="text-center">
          <p className="public-eyebrow">Contacto</p>
          <h2 className="public-heading mt-3" id="contact-title">Estamos para ayudarte</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Elegí el canal que necesites. También contamos con guardia de soporte fuera del horario habitual.</p>
        </div>
        {unavailable ? <p className="public-empty-state" role="status">Los datos de contacto no están disponibles en este momento.</p> : contact ? (
          <div className="mx-auto mt-10 max-w-6xl">
            <ul className="grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
              {whatsapp && (
                <li className={channelCardClass}>
                  <ChannelIcon icon={MessageCircle} />
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-slate-500">WhatsApp</p>
                  <p className="mt-2 break-words text-lg font-bold text-slate-950">{whatsapp}</p>
                  <a className={`${channelLinkClass} text-emerald-700 hover:text-emerald-800 focus-visible:outline-emerald-600`} href={`https://wa.me/${whatsappDigits}`} rel="noreferrer" target="_blank">Escribir por WhatsApp <ArrowRight aria-hidden="true" className="ml-1 size-4" /></a>
                </li>
              )}
              {contact.commercial_email && (
                <li className={channelCardClass}>
                  <ChannelIcon icon={Mail} />
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Email comercial</p>
                  <p className="mt-2 min-w-0 break-words text-base font-bold text-slate-950">{contact.commercial_email}</p>
                  <a className={channelLinkClass} href={`mailto:${contact.commercial_email}`}>Enviar email <ArrowRight aria-hidden="true" className="ml-1 size-4" /></a>
                </li>
              )}
              {contact.address && mapUrl && (
                <li className={channelCardClass}>
                  <ChannelIcon icon={MapPin} />
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Dónde estamos</p>
                  <p className="mt-2 break-words text-lg font-bold text-slate-950">{contact.address}</p>
                  <a className={channelLinkClass} href={mapUrl} rel="noreferrer" target="_blank">Cómo llegar <ArrowRight aria-hidden="true" className="ml-1 size-4" /></a>
                </li>
              )}
              {phone && (
                <li className={channelCardClass}>
                  <ChannelIcon icon={Phone} />
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Teléfono</p>
                  <p className="mt-2 break-words text-lg font-bold text-slate-950">{phone}</p>
                  <a className={channelLinkClass} href={`tel:${phone.replace(/[^\d+]/g, "")}`}>Llamar <ArrowRight aria-hidden="true" className="ml-1 size-4" /></a>
                </li>
              )}
            </ul>

            <div className="mt-5 grid items-start gap-5 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <ChannelIcon icon={Clock3} />
                <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Atención habitual</p>
                <h3 className="mt-2 text-xl font-bold text-slate-950">Horarios de atención</h3>
                {contact.business_hours && <Hours value={contact.business_hours} />}
              </article>
              <article className="rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm sm:p-7">
                <ChannelIcon icon={Headset} />
                <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-orange-700">Fuera del horario habitual</p>
                <h3 className="mt-2 text-xl font-bold text-slate-950">Guardia de soporte</h3>
                {contact.guard_hours && <Hours value={contact.guard_hours} />}
                {whatsapp && <a className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-center font-bold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600" href={`https://wa.me/${whatsappDigits}`} rel="noreferrer" target="_blank">WhatsApp de guardia</a>}
              </article>
            </div>
          </div>
        ) : <p className="public-empty-state">Próximamente vas a poder encontrar aquí todos nuestros canales de contacto.</p>}
      </div>
    </section>
  );
}
