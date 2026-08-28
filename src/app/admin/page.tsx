import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DashboardCard } from "@/components/admin/dashboard-card";

export default function AdminPage() {
  return (
    <>
      <AdminPageHeader description="Gestioná el contenido y configuración de Conectar Servicios." title="Panel administrativo" />
      <section aria-labelledby="quick-access-title">
        <h2 id="quick-access-title" className="mb-4 text-sm font-bold tracking-wide text-slate-700 uppercase">Accesos rápidos</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard description="Administrá la oferta de planes, velocidades y precios." href="/admin/plans" title="Planes" />
          <DashboardCard description="Organizá los servicios disponibles para clientes." href="/admin/services" title="Servicios" />
          <DashboardCard description="Gestioná planes, packs, compatibilidad y ayuda del servicio." href="/admin/conectar-play" title="Conectar Play" />
          <DashboardCard description="Publicá y mantené actualizadas las novedades." href="/admin/news" title="Noticias" />
          <DashboardCard description="Gestioná las campañas y promociones vigentes." href="/admin/promotions" title="Promociones" />
        </div>
      </section>
    </>
  );
}
