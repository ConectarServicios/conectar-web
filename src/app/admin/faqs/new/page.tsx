import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FaqForm } from "@/components/admin/faqs/faq-form";
export default function NewFaqPage() {
  return (
    <>
      <AdminPageHeader
        description="Completá la consulta y su respuesta en texto plano."
        title="Nueva pregunta frecuente"
      />
      <FaqForm />
    </>
  );
}
