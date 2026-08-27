import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceForm } from "@/components/admin/services/service-form";

export default function NewServicePage() {
  return <><AdminPageHeader description="Completá los datos y la presentación del nuevo servicio." title="Nuevo servicio" /><ServiceForm /></>;
}
