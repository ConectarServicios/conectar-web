import Link from "next/link";

import { toggleEventFeatured, updateEventStatus } from "@/app/admin/events/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EventDeleteButton } from "@/components/admin/events/event-delete-button";
import { EVENT_SELECT } from "@/lib/supabase/events";
import { createClient } from "@/lib/supabase/server";
import { eventTemporalStatus, sortEvents } from "@/lib/utils/event-dates";
import { argentinaAdminDateTimeFormatter } from "@/lib/utils/news-dates";
import type { EventItem, EventTemporalStatus } from "@/types/events";

const successMessages: Record<string, string> = {
  created: "El evento se creó correctamente.",
  updated: "El evento se actualizó correctamente.",
  deleted: "El evento se eliminó correctamente.",
  published: "El evento quedó publicado.",
  draft: "El evento volvió a borrador.",
  archived: "El evento quedó archivado.",
  featured: "El evento quedó destacado.",
  unfeatured: "El evento dejó de estar destacado.",
};
const editorialLabels = { draft: "Borrador", published: "Publicado", archived: "Archivado" };
const temporalLabels: Record<EventTemporalStatus, string> = {
  upcoming: "Próximo",
  ongoing: "En curso",
  finished: "Finalizado",
  unscheduled: "Sin fecha",
};
const formatDate = (value: string | null) =>
  value ? argentinaAdminDateTimeFormatter.format(new Date(value)) : "—";

export default async function EventsAdminPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ success?: string; error?: string }> }>) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select(EVENT_SELECT);
  const events = sortEvents((data ?? []) as EventItem[]);

  return (
    <>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <AdminPageHeader
          description="Administrá la agenda institucional y su publicación."
          title="Eventos"
        />
        <Link
          className="rounded-xl bg-orange-600 px-5 py-3 font-bold text-white"
          href="/admin/events/new"
        >
          Nuevo evento
        </Link>
      </div>
      {params.success && successMessages[params.success] && (
        <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {successMessages[params.success]}
        </p>
      )}
      {params.error && (
        <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {params.error === "image-cleanup"
            ? "El evento se guardó, pero no pudimos limpiar la imagen anterior."
            : "No pudimos completar la acción o no tenés permiso."}
        </p>
      )}
      {error ? (
        <div className="rounded-2xl border bg-white p-8 text-center">
          No pudimos cargar los eventos.
        </div>
      ) : !events.length ? (
        <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
          <h2 className="text-xl font-bold">Todavía no hay eventos.</h2>
        </div>
      ) : (
        <EventTable events={events} />
      )}
    </>
  );
}

function EventTable({ events }: Readonly<{ events: EventItem[] }>) {
  return (
    <div className="grid gap-4 xl:block xl:overflow-hidden xl:rounded-2xl xl:border xl:bg-white">
      <div className="hidden grid-cols-[1.2fr_.75fr_.8fr_.8fr_.8fr_.6fr_.45fr_1.7fr] gap-3 bg-slate-50 px-5 py-3 text-xs font-bold uppercase text-slate-600 xl:grid">
        <span>Título</span><span>Editorial</span><span>Temporal</span><span>Inicio</span>
        <span>Finalización</span><span>Lugar</span><span>Dest.</span><span>Acciones</span>
      </div>
      {events.map((item) => (
        <EventRow item={item} key={item.id} />
      ))}
    </div>
  );
}

function EventRow({ item }: Readonly<{ item: EventItem }>) {
  const temporalStatus = eventTemporalStatus(item);
  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm xl:grid xl:grid-cols-[1.2fr_.75fr_.8fr_.8fr_.8fr_.6fr_.45fr_1.7fr] xl:items-center xl:gap-3 xl:rounded-none xl:border-0 xl:border-b xl:shadow-none">
      <h2 className="font-bold">{item.title}</h2>
      <AdminCell label="Editorial">{editorialLabels[item.status]}</AdminCell>
      <AdminCell label="Temporal">{temporalLabels[temporalStatus]}</AdminCell>
      <AdminCell label="Inicio">{formatDate(item.starts_at)}</AdminCell>
      <AdminCell label="Fin">{formatDate(item.ends_at)}</AdminCell>
      <AdminCell label="Lugar">{item.location ?? "—"}</AdminCell>
      <AdminCell label="Destacada">{item.featured ? "Sí" : "No"}</AdminCell>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm xl:mt-0">
        <Link className="font-bold text-orange-700" href={`/admin/events/${item.id}/edit`}>
          Editar
        </Link>
        <form action={updateEventStatus}>
          <input name="id" type="hidden" value={item.id} />
          <input name="status" type="hidden" value={item.status === "published" ? "draft" : "published"} />
          <button className="font-bold text-slate-700">
            {item.status === "published" ? "A borrador" : "Publicar"}
          </button>
        </form>
        {item.status !== "archived" && (
          <form action={updateEventStatus}>
            <input name="id" type="hidden" value={item.id} />
            <input name="status" type="hidden" value="archived" />
            <button className="font-bold text-slate-700">Archivar</button>
          </form>
        )}
        <form action={toggleEventFeatured}>
          <input name="id" type="hidden" value={item.id} />
          <input name="featured" type="hidden" value={String(!item.featured)} />
          <button className="font-bold text-slate-700">
            {item.featured ? "Quitar destacado" : "Destacar"}
          </button>
        </form>
        <EventDeleteButton id={item.id} title={item.title} />
      </div>
    </article>
  );
}

function AdminCell({ children, label }: Readonly<{ children: React.ReactNode; label: string }>) {
  return (
    <p className="mt-2 text-sm xl:mt-0">
      <span className="font-semibold xl:hidden">{label}: </span>
      {children}
    </p>
  );
}
