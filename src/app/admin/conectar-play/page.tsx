import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ConectarPlayDeleteButton } from "@/components/admin/conectar-play/conectar-play-delete-button";
import { FaqForm, PackForm, PlanForm, SettingsForm } from "@/components/admin/conectar-play/conectar-play-forms";
import { createClient } from "@/lib/supabase/server";
import type { ConectarPlayFaq, ConectarPlayPack, ConectarPlayPlan, ConectarPlaySettings } from "@/types/conectar-play";

const box = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";

export default async function ConectarPlayAdminPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const query = await searchParams; const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  const [profileResult, settingsResult, plansResult, packsResult, faqsResult] = await Promise.all([
    supabase.from("profiles").select("active, role").eq("id", user?.id ?? "").maybeSingle(),
    supabase.from("conectar_play_settings").select("*").maybeSingle(),
    supabase.from("conectar_play_plans").select("*").order("display_order"),
    supabase.from("conectar_play_packs").select("*").order("display_order"),
    supabase.from("conectar_play_faqs").select("*").order("display_order"),
  ]);
  for (const [name, result] of [["settings", settingsResult], ["plans", plansResult], ["packs", packsResult], ["FAQs", faqsResult]] as const) if (result.error) console.error(`Unable to load Conectar Play ${name}`, result.error);
  const canManageSettings = Boolean(profileResult.data?.active && ["admin", "super_admin"].includes(profileResult.data.role));
  const plans = (plansResult.data ?? []) as ConectarPlayPlan[]; const packs = (packsResult.data ?? []) as ConectarPlayPack[]; const faqs = (faqsResult.data ?? []) as ConectarPlayFaq[];
  return <><AdminPageHeader description="Gestioná la configuración, la oferta y la ayuda pública del servicio." title="Conectar Play" />
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="Secciones de Conectar Play">{[["Configuración", "configuracion"], ["Planes", "play-planes"], ["Packs adicionales", "packs"], ["Preguntas frecuentes", "play-faqs"]].map(([label, id]) => <a className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-orange-400" href={`#${id}`} key={id}>{label}</a>)}</nav>
    {query.success && <p className="mb-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800" role="status">Los cambios se guardaron correctamente.</p>}{query.error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-800" role="alert">No pudimos completar la acción.</p>}
    <div className="space-y-7">
      <section className={box} id="configuracion"><h2 className="mb-5 text-xl font-black text-slate-950">Configuración general</h2><SettingsForm canManage={canManageSettings} value={settingsResult.data as ConectarPlaySettings | null} /></section>
      <section className={box} id="play-planes"><h2 className="text-xl font-black text-slate-950">Planes</h2><p className="mb-5 mt-1 text-sm text-slate-600">Administrá precios y promociones sin asumir un precio regular.</p><details className="mb-5 rounded-xl border border-orange-200 bg-orange-50 p-4"><summary className="cursor-pointer font-bold text-orange-900">Crear plan</summary><div className="mt-4"><PlanForm /></div></details><div className="space-y-3">{plans.map((item) => <details className="rounded-xl border border-slate-200 p-4" key={item.id}><summary className="cursor-pointer font-bold">{item.name} · ${Number(item.promotional_price).toLocaleString("es-AR")} · {item.active ? "Activo" : "Inactivo"}</summary><div className="mt-4"><PlanForm value={item} /><div className="mt-3"><ConectarPlayDeleteButton id={item.id} itemName={item.name} itemType="plan" table="conectar_play_plans" /></div></div></details>)}</div></section>
      <section className={box} id="packs"><h2 className="mb-5 text-xl font-black text-slate-950">Packs adicionales</h2><details className="mb-5 rounded-xl border border-orange-200 bg-orange-50 p-4"><summary className="cursor-pointer font-bold text-orange-900">Crear pack</summary><div className="mt-4"><PackForm /></div></details><div className="space-y-3">{packs.map((item) => <details className="rounded-xl border border-slate-200 p-4" key={item.id}><summary className="cursor-pointer font-bold">{item.name} · {item.active ? "Activo" : "Inactivo"}</summary><div className="mt-4"><PackForm value={item} /><div className="mt-3"><ConectarPlayDeleteButton id={item.id} itemName={item.name} itemType="pack adicional" table="conectar_play_packs" /></div></div></details>)}</div></section>
      <section className={box} id="play-faqs"><h2 className="mb-5 text-xl font-black text-slate-950">Preguntas frecuentes</h2><details className="mb-5 rounded-xl border border-orange-200 bg-orange-50 p-4"><summary className="cursor-pointer font-bold text-orange-900">Crear pregunta</summary><div className="mt-4"><FaqForm /></div></details><div className="space-y-3">{faqs.map((item) => <details className="rounded-xl border border-slate-200 p-4" key={item.id}><summary className="cursor-pointer font-bold">{item.question} · {item.active ? "Activa" : "Inactiva"}</summary><div className="mt-4"><FaqForm value={item} /><div className="mt-3"><ConectarPlayDeleteButton id={item.id} itemName={item.question} itemType="pregunta frecuente" table="conectar_play_faqs" /></div></div></details>)}</div></section>
    </div></>;
}
