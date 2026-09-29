import { WhatsAppIcon } from "@/components/public/whatsapp-icon";
import { getPublicContactInformation } from "@/lib/supabase/contact-information";
import { getPublicMeshPricing } from "@/lib/supabase/mesh-pricing";
import { isAllowedContactNumber } from "@/lib/validations/contact-information";

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export async function MeshPricingSection() {
  const [pricing, contact] = await Promise.all([
    getPublicMeshPricing(),
    getPublicContactInformation(),
  ]);
  if (pricing.length === 0) return null;

  const rentals = pricing.filter((item) => item.mode === "rental");
  const purchase = pricing.find((item) => item.mode === "purchase");
  const whatsapp = contact.data?.whatsapp;
  const whatsappUrl = whatsapp && isAllowedContactNumber(whatsapp)
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hola, quiero consultar por WiFi Power Mesh.")}`
    : null;

  return (
    <section aria-labelledby="mesh-pricing-title" className="mt-12 overflow-hidden rounded-3xl border border-home-border bg-home-surface-soft p-5 sm:mt-16 sm:p-8 lg:p-10">
      <p className="text-xs font-black tracking-[0.18em] text-orange-700 uppercase">Wi-Fi en todos tus ambientes</p>
      <h2 className="mt-3 max-w-2xl text-2xl font-black tracking-tight text-brand-navy-deep sm:text-3xl" id="mesh-pricing-title">
        Elegí la opción que mejor se adapta a tu hogar
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">Podés sumar uno o más equipos Mesh en modalidad de alquiler o adquirirlos.</p>

      {rentals.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-extrabold text-brand-navy">Alquiler mensual</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 lg:grid-cols-4">
            {rentals.map((item) => (
              <div className="min-w-0 rounded-2xl border border-home-border bg-white p-4 shadow-sm sm:p-5" key={item.id}>
                <p className="font-bold text-brand-navy">{item.equipment_count} {item.equipment_count === 1 ? "equipo" : "equipos"}</p>
                <p className="mt-3 break-words text-2xl font-black tracking-tight text-brand-navy-deep sm:text-3xl">{item.price_label || priceFormatter.format(item.price)}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">por mes</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {purchase && (
        <div className="mt-8">
          <h3 className="text-lg font-extrabold text-brand-navy">También podés comprarlo</h3>
          <div className="mt-4 flex flex-col gap-5 rounded-2xl bg-brand-navy-deep p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-w-0">
              <p className="font-bold text-brand-yellow">WiFi Power Mesh</p>
              <p className="mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl">{purchase.price_label || priceFormatter.format(purchase.price)}</p>
              <p className="mt-1 text-sm text-slate-300">por equipo</p>
            </div>
            {whatsappUrl && (
              <a className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-center font-extrabold text-brand-navy-deep transition-colors hover:bg-whatsapp-strong hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp sm:w-auto sm:shrink-0" href={whatsappUrl} rel="noopener noreferrer" target="_blank">
                <WhatsAppIcon className="size-5 shrink-0" />
                Consultar por WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
