import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EventActionsMenu } from "@/components/admin/events/event-actions-menu";
import { EVENT_SELECT } from "@/lib/supabase/events";
import { createClient } from "@/lib/supabase/server";
import {
  eventAdminDateFormatter,
  eventTemporalStatus,
  eventTimeFormatter,
  sortEvents,
} from "@/lib/utils/event-dates";
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
    <div className="grid gap-4 xl:block xl:rounded-2xl xl:border xl:bg-white">
      <div className="hidden grid-cols-[1.3fr_.75fr_.75fr_.8fr_.8fr_.7fr_.4fr_1fr] gap-3 rounded-t-2xl bg-slate-50 px-5 py-3 text-xs font-bold uppercase text-slate-600 xl:grid">
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
    <article className="rounded-2xl border bg-white p-5 shadow-sm xl:grid xl:grid-cols-[1.3fr_.75fr_.75fr_.8fr_.8fr_.7fr_.4fr_1fr] xl:items-center xl:gap-3 xl:rounded-none xl:border-0 xl:border-b xl:shadow-none">
      <h2 className="font-bold">{item.title}</h2>
      <AdminCell label="Editorial">
        <StatusBadge tone="editorial">{editorialLabels[item.status]}</StatusBadge>
      </AdminCell>
      <AdminCell label="Temporal">
        <StatusBadge tone="temporal">{temporalLabels[temporalStatus]}</StatusBadge>
      </AdminCell>
      <AdminCell label="Inicio"><AdminEventDate value={item.starts_at} /></AdminCell>
      <AdminCell label="Fin"><AdminEventDate value={item.ends_at} /></AdminCell>
      <AdminCell label="Lugar">{item.location ?? "—"}</AdminCell>
      <AdminCell label="Destacada">{item.featured ? "Sí" : "No"}</AdminCell>
      <div className="col-span-full mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-sm xl:col-span-1 xl:mt-0 xl:border-0 xl:pt-0">
        <Link
          className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 font-bold text-orange-800 hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-orange-500"
          href={`/admin/events/${item.id}/edit`}
        >
          Editar
        </Link>
        <EventActionsMenu
          featured={item.featured}
          id={item.id}
          status={item.status}
          title={item.title}
        />
      </div>
    </article>
  );
}

function AdminEventDate({ value }: Readonly<{ value: string | null }>) {
  if (!value) return <>—</>;
  const date = new Date(value);
  return (
    <time className="block leading-5" dateTime={value}>
      <span className="block whitespace-nowrap">{eventAdminDateFormatter.format(date)}</span>
      <span className="block font-semibold text-slate-700">
        {eventTimeFormatter.format(date)}
      </span>
    </time>
  );
}

function StatusBadge({
  children,
  tone,
}: Readonly<{ children: React.ReactNode; tone: "editorial" | "temporal" }>) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        tone === "editorial"
          ? "bg-slate-100 text-slate-700"
          : "bg-blue-50 text-blue-800"
      }`}
    >
      {children}
    </span>
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
