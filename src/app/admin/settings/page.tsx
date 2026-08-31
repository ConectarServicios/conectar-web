import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  IdentitySettingsForm,
  InternetSettingsForm,
  SeoSettingsForm,
} from "@/components/admin/settings/settings-forms";
import { getPublicSiteConfiguration } from "@/lib/supabase/site-settings";
import { createClient } from "@/lib/supabase/server";

const sections = [
  {
    id: "internet-settings-title",
    title: "Internet",
    description: "Definí el precio y el mensaje de instalación informados junto a los planes públicos.",
    Form: InternetSettingsForm,
  },
  {
    id: "identity-settings-title",
    title: "Identidad pública",
    description: "Configurá el nombre y los textos institucionales que identifican al sitio.",
    Form: IdentitySettingsForm,
  },
  {
    id: "seo-settings-title",
    title: "SEO general",
    description: "Definí los metadatos utilizados cuando una página pública no tiene información específica.",
    Form: SeoSettingsForm,
  },
] as const;

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [{ data: profile, error: profileError }, configuration] = await Promise.all([
    supabase.from("profiles").select("active, role").eq("id", user?.id ?? "").maybeSingle(),
    getPublicSiteConfiguration(),
  ]);

  if (profileError) console.error("Unable to verify settings authorization", profileError);
  const canManage = Boolean(profile?.active && ["admin", "super_admin"].includes(profile.role));

  return (
    <>
      <AdminPageHeader
        description="Administrá la configuración general y pública del sitio."
        title="Configuración del sitio"
      />
      <div className="space-y-6">
        {sections.map(({ Form, description, id, title }) => (
          <section
            aria-labelledby={id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            key={id}
          >
            <h2 className="text-xl font-bold text-slate-950" id={id}>{title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
            {canManage ? (
              <Form configuration={configuration} />
            ) : (
              <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Solo administradores y super administradores pueden modificar esta configuración.
              </p>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
