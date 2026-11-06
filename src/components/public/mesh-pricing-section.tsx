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
    <section aria-labelledby="mesh-pricing-title" className="bg-[#EAF2FA] py-12 sm:py-16">
      <div className="public-container">
        <p className="text-xs font-black tracking-[0.18em] text-[#315C88] uppercase">Wi-Fi en todos tus ambientes</p>
        <h2 className="public-heading mt-3 max-w-3xl text-[#071C31]" id="mesh-pricing-title">
          Elegí la opción que mejor se adapta a tu hogar
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">Podés sumar uno o más equipos Mesh en modalidad de alquiler o adquirirlos.</p>

        {rentals.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-black text-[#071C31]">Alquiler mensual</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 lg:grid-cols-4">
              {rentals.map((item) => (
                <div className="min-w-0 rounded-2xl border border-[#B9CCE0] bg-white p-5 shadow-sm transition duration-150 hover:border-[#315C88]/50 hover:shadow-md motion-reduce:transition-none sm:p-6" key={item.id}>
                  <p className="font-bold text-[#315C88]">{item.equipment_count} {item.equipment_count === 1 ? "equipo" : "equipos"}</p>
                  <p className="mt-4 break-words text-3xl font-black tracking-tight text-[#071C31]">{item.price_label || priceFormatter.format(item.price)}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">por mes</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {purchase && (
          <div className="mt-8">
            <h3 className="text-xl font-black text-[#071C31]">También podés comprarlo</h3>
            <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-[#315C88]/40 bg-[#071C31] p-5 text-white shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
              <div className="min-w-0">
                <p className="font-bold text-[#D7E4F2]">WiFi Power Mesh</p>
                <p className="mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl">{purchase.price_label || priceFormatter.format(purchase.price)}</p>
                <p className="mt-1 text-sm text-[#D7E4F2]">por equipo</p>
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
      </div>
    </section>
  );
}
