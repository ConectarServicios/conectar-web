import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { InstallationBenefitsForm } from "@/components/admin/settings/installation-benefits-form";
import { InstallationPriceForm } from "@/components/admin/settings/installation-price-form";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile, error: profileError }, { data: priceSetting, error: priceError }, { data: benefitsSetting, error: benefitsError }] = await Promise.all([
    supabase.from("profiles").select("active, role").eq("id", user?.id ?? "").maybeSingle(),
    supabase.from("site_settings").select("value").eq("key", "internet_installation_price").maybeSingle(),
    supabase.from("site_settings").select("value").eq("key", "internet_installation_benefits_text").maybeSingle(),
  ]);
  if (profileError) console.error("Unable to verify settings authorization", profileError);
  if (priceError) console.error("Unable to load internet installation price", priceError);
  if (benefitsError) console.error("Unable to load internet installation benefits text", benefitsError);

  const canManage = Boolean(profile?.active && ["admin", "super_admin"].includes(profile.role));
  const currentPrice = typeof priceSetting?.value === "number" && Number.isFinite(priceSetting.value) && priceSetting.value >= 0 ? priceSetting.value : null;
  const currentBenefits = typeof benefitsSetting?.value === "string" ? benefitsSetting.value : "";

  return (
    <>
      <AdminPageHeader description="Administrá la configuración general y pública del sitio." title="Configuración del sitio" />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="internet-settings-title">
        <h2 className="text-xl font-bold text-slate-950" id="internet-settings-title">Internet</h2>
        <p className="mt-2 text-sm text-slate-600">Definí el valor de instalación que se informa junto a los planes públicos.</p>
        {canManage ? <div className="space-y-6"><InstallationPriceForm currentValue={currentPrice} /><InstallationBenefitsForm currentValue={currentBenefits} /></div> : <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Solo administradores y super administradores pueden modificar esta configuración.</p>}
      </section>
    </>
  );
}
