import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MeshPricingForm } from "@/components/admin/mesh/mesh-pricing-form";
import { getAdminMeshPricing } from "@/lib/supabase/mesh-pricing";

export default async function MeshAdminPage() {
  const rows = await getAdminMeshPricing();
  return (
    <>
      <AdminPageHeader
        description="Administrá los precios de alquiler y compra que se muestran en la novedad de Power Mesh."
        title="WiFi Power Mesh"
      />
      <MeshPricingForm rows={rows} />
    </>
  );
}
