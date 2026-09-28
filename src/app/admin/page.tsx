import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DashboardCard } from "@/components/admin/dashboard-card";
import { getNavigationForRole } from "@/components/admin/admin-navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminRole } from "@/types/admin";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id ?? "").maybeSingle();
  const items = isAdminRole(profile?.role)
    ? getNavigationForRole(profile.role).filter((item) => item.href !== "/admin")
    : [];

  return (
    <>
      <AdminPageHeader description="Gestioná el contenido y configuración de Conectar Servicios." title="Panel administrativo" />
      <section aria-labelledby="quick-access-title">
        <h2 id="quick-access-title" className="mb-4 text-sm font-bold tracking-wide text-slate-700 uppercase">Accesos rápidos</h2>
        <p className="mb-5 max-w-2xl text-sm text-slate-600">Las mismas secciones disponibles en el menú, según los permisos de tu cuenta.</p>
        <div className="grid gap-3 min-[430px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((item) => <DashboardCard href={item.href} icon={item.icon} key={item.href} title={item.label} />)}
        </div>
      </section>
    </>
  );
}
