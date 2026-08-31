import { ARGENTINA_TIME_ZONE } from "@/lib/utils/news-dates";
import type { EventItem, EventTemporalStatus } from "@/types/events";

export const eventDateFormatter = new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeZone: ARGENTINA_TIME_ZONE });
export const eventTimeFormatter = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", timeZone: ARGENTINA_TIME_ZONE });
export const eventMonthFormatter = new Intl.DateTimeFormat("es-AR", { month: "short", timeZone: ARGENTINA_TIME_ZONE });
export const eventDayFormatter = new Intl.DateTimeFormat("es-AR", { day: "2-digit", timeZone: ARGENTINA_TIME_ZONE });

/** Events without an end remain ongoing until the end of their Buenos Aires calendar day. */
export function eventTemporalStatus(event: Pick<EventItem, "starts_at" | "ends_at">, now = new Date()): EventTemporalStatus {
  if (!event.starts_at) return "unscheduled";
  const starts = new Date(event.starts_at);
  if (starts > now) return "upcoming";
  if (event.ends_at) return new Date(event.ends_at) < now ? "finished" : "ongoing";
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: ARGENTINA_TIME_ZONE }).format(starts);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: ARGENTINA_TIME_ZONE }).format(now);
  return day < today ? "finished" : "ongoing";
}

export function sortEvents(items: EventItem[], now = new Date()) {
  const rank = (item: EventItem) => ["upcoming", "ongoing"].includes(eventTemporalStatus(item, now)) ? 0 : 1;
  return [...items].sort((a, b) => rank(a) - rank(b) || Number(b.featured) - Number(a.featured) ||
    (rank(a) === 0 ? (a.starts_at ?? "").localeCompare(b.starts_at ?? "") : (b.starts_at ?? "").localeCompare(a.starts_at ?? "")));
}
