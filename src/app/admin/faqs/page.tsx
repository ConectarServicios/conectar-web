import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FaqActionsMenu } from "@/components/admin/faqs/faq-actions-menu";
import { FAQ_SELECT } from "@/lib/supabase/faqs";
import { createClient } from "@/lib/supabase/server";
import type { FaqItem } from "@/types/faqs";

const successMessages: Record<string, string> = {
  created: "La pregunta frecuente se creó correctamente.",
  updated: "La pregunta frecuente se actualizó correctamente.",
  deleted: "La pregunta frecuente se eliminó correctamente.",
  activated: "La pregunta quedó activa.",
  deactivated: "La pregunta quedó inactiva.",
  featured: "La pregunta quedó destacada.",
  unfeatured: "La pregunta dejó de estar destacada.",
};

export default async function FaqsAdminPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ success?: string; error?: string }> }>) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select(FAQ_SELECT)
    .order("active", { ascending: false })
    .order("featured", { ascending: false })
    .order("category")
    .order("display_order")
    .order("created_at");
  const faqs = (data ?? []) as FaqItem[];
  return (
    <>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <AdminPageHeader
          description="Administrá las respuestas a las consultas más habituales."
          title="Preguntas frecuentes"
        />
        <Link
          className="rounded-xl bg-orange-600 px-5 py-3 font-bold text-white"
          href="/admin/faqs/new"
        >
          Nueva pregunta
        </Link>
      </div>
      {params.success && successMessages[params.success] && (
        <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {successMessages[params.success]}
        </p>
      )}
      {params.error && (
        <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          No pudimos completar la acción o no tenés permiso.
        </p>
      )}
      {error ? (
        <div className="rounded-2xl border bg-white p-8 text-center">
          No pudimos cargar las preguntas frecuentes.
        </div>
      ) : !faqs.length ? (
        <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
          <h2 className="text-xl font-bold">
            Todavía no hay preguntas frecuentes.
          </h2>
          <p className="mt-2 text-slate-600">
            Creá la primera para comenzar a resolver consultas.
          </p>
        </div>
      ) : (
        <FaqTable faqs={faqs} />
      )}
    </>
  );
}

function FaqTable({ faqs }: Readonly<{ faqs: FaqItem[] }>) {
  return (
    <div className="grid gap-4 xl:block xl:rounded-2xl xl:border xl:bg-white">
      <div className="hidden grid-cols-[2fr_1fr_.65fr_.65fr_.4fr_1fr] gap-3 rounded-t-2xl bg-slate-50 px-5 py-3 text-xs font-bold uppercase text-slate-600 xl:grid">
        <span>Pregunta</span>
        <span>Categoría</span>
        <span>Estado</span>
        <span>Destacada</span>
        <span>Orden</span>
        <span>Acciones</span>
      </div>
      {faqs.map((faq) => (
        <article
          className="rounded-2xl border bg-white p-5 shadow-sm xl:grid xl:grid-cols-[2fr_1fr_.65fr_.65fr_.4fr_1fr] xl:items-center xl:gap-3 xl:rounded-none xl:border-0 xl:border-b xl:shadow-none"
          key={faq.id}
        >
          <h2 className="font-bold leading-6">{faq.question}</h2>
          <AdminCell label="Categoría">{faq.category}</AdminCell>
          <AdminCell label="Estado">
            <Badge active={faq.active}>
              {faq.active ? "Activa" : "Inactiva"}
            </Badge>
          </AdminCell>
          <AdminCell label="Destacada">{faq.featured ? "Sí" : "No"}</AdminCell>
          <AdminCell label="Orden">{faq.display_order}</AdminCell>
          <div className="col-span-full mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-sm xl:col-span-1 xl:mt-0 xl:border-0 xl:pt-0">
            <Link
              className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 font-bold text-orange-800 hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-orange-500"
              href={`/admin/faqs/${faq.id}/edit`}
            >
              Editar
            </Link>
            <FaqActionsMenu
              active={faq.active}
              featured={faq.featured}
              id={faq.id}
              question={faq.question}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
function AdminCell({
  children,
  label,
}: Readonly<{ children: React.ReactNode; label: string }>) {
  return (
    <p className="mt-2 text-sm xl:mt-0">
      <span className="font-semibold xl:hidden">{label}: </span>
      {children}
    </p>
  );
}
function Badge({
  active,
  children,
}: Readonly<{ active: boolean; children: React.ReactNode }>) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${active ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"}`}
    >
      {children}
    </span>
  );
}
