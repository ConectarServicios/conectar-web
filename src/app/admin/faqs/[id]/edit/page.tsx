import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FaqForm } from "@/components/admin/faqs/faq-form";
import { FAQ_SELECT } from "@/lib/supabase/faqs";
import { createClient } from "@/lib/supabase/server";
import type { FaqItem } from "@/types/faqs";

export default async function EditFaqPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select(FAQ_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) notFound();
  const item = data as FaqItem;
  return (
    <>
      <AdminPageHeader
        description={`Actualizá “${item.question}”.`}
        title="Editar pregunta frecuente"
      />
      <FaqForm
        id={item.id}
        initialValues={{
          question: item.question,
          answer: item.answer,
          category: item.category,
          active: item.active,
          featured: item.featured,
          display_order: item.display_order,
        }}
      />
    </>
  );
}
