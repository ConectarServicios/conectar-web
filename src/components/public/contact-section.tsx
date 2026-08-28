import type { ContactInformation } from "@/types/contact-information";
import { isAllowedContactNumber } from "@/lib/validations/contact-information";

function Hours({ value }: Readonly<{ value: string }>) {
  return <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">{value}</p>;
}

export function ContactSection({ contact, unavailable }: Readonly<{ contact: ContactInformation | null; unavailable: boolean }>) {
  const whatsapp = contact?.whatsapp && isAllowedContactNumber(contact.whatsapp) ? contact.whatsapp : null;
  const whatsappDigits = whatsapp?.replace(/\D/g, "") ?? "";
  const phone = contact?.phone && isAllowedContactNumber(contact.phone) ? contact.phone : null;

  return (
    <section className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-20 sm:py-24" id="contacto" aria-labelledby="contact-title">
      <div className="public-container">
        <div className="text-center">
          <p className="public-eyebrow">Contacto</p>
          <h2 className="public-heading mt-3" id="contact-title">Estamos para ayudarte</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Consultanos durante nuestros horarios de atención o escribí a la guardia de soporte.</p>
        </div>
        {unavailable ? <p className="public-empty-state" role="status">Los datos de contacto no están disponibles en este momento.</p> : contact ? (
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
              <h3 className="text-xl font-bold text-slate-950">Canales de contacto</h3>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {whatsapp && <div><dt className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">WhatsApp</dt><dd className="mt-1"><a className="font-semibold text-emerald-700 underline-offset-4 hover:underline" href={`https://wa.me/${whatsappDigits}`} rel="noreferrer" target="_blank">{whatsapp}</a></dd></div>}
                {contact.commercial_email && <div><dt className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Email comercial</dt><dd className="mt-1 break-words"><a className="font-semibold text-orange-700 underline-offset-4 hover:underline" href={`mailto:${contact.commercial_email}`}>{contact.commercial_email}</a></dd></div>}
                {contact.address && <div><dt className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Dirección</dt><dd className="mt-1 text-slate-700">{contact.address}</dd></div>}
                {phone && <div><dt className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Teléfono</dt><dd className="mt-1"><a className="font-semibold text-slate-800 underline-offset-4 hover:underline" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a></dd></div>}
              </dl>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Atención habitual</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">Horarios de atención</h3>
              {contact.business_hours && <Hours value={contact.business_hours} />}
            </article>
            <article className="rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">Fuera del horario habitual</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">Guardia de soporte</h3>
              {contact.guard_hours && <Hours value={contact.guard_hours} />}
              {whatsapp && <a className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600" href={`https://wa.me/${whatsappDigits}`} rel="noreferrer" target="_blank">WhatsApp de guardia: {whatsapp}</a>}
            </article>
          </div>
        ) : <p className="public-empty-state">Próximamente vas a poder encontrar aquí todos nuestros canales de contacto.</p>}
      </div>
    </section>
  );
}
