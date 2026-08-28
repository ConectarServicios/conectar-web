import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContactInformationForm } from "@/components/admin/contact/contact-information-form";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile, error: profileError }, { data: contact, error: contactError }] = await Promise.all([
    supabase.from("profiles").select("active, role").eq("id", user?.id ?? "").maybeSingle(),
    supabase.from("contact_information").select("phone, whatsapp, commercial_email, address, business_hours, guard_hours").maybeSingle(),
  ]);
  if (profileError) console.error("Unable to verify contact authorization", profileError);
  if (contactError) console.error("Unable to load contact information", contactError);
  const canManage = Boolean(profile?.active && ["admin", "super_admin"].includes(profile.role));

  return (
    <>
      <AdminPageHeader description="Mantené actualizados los canales de contacto institucionales." title="Datos de contacto" />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="contact-information-title">
        <h2 className="text-xl font-bold text-slate-950" id="contact-information-title">Información institucional</h2>
        <p className="mt-2 text-sm text-slate-600">Administrá los canales públicos y los horarios de atención y guardia.</p>
        {canManage ? <ContactInformationForm contact={{ phone: contact?.phone ?? null, whatsapp: contact?.whatsapp ?? null, commercial_email: contact?.commercial_email ?? null, address: contact?.address ?? null, business_hours: contact?.business_hours ?? null, guard_hours: contact?.guard_hours ?? null }} /> : <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Solo administradores y super administradores pueden modificar los datos de contacto.</p>}
      </section>
    </>
  );
}
