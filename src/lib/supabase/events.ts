import { createClient } from "@/lib/supabase/server";
import { sortEvents } from "@/lib/utils/event-dates";
import { ARGENTINA_TIME_ZONE } from "@/lib/utils/news-dates";
import type { EventItem } from "@/types/events";

export const EVENTS_BUCKET = "event-images";
export const EVENT_SELECT =
  "id,title,slug,summary,description,image_path,location,address,starts_at,ends_at,status,featured,button_text,button_url,created_at,updated_at";

export function eventImageUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  path: string | null,
) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return supabase.storage.from(EVENTS_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function getPublicEvents() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published");

  if (error) {
    console.error("Unable to load public events", error);
    return [];
  }

  return sortEvents((data ?? []) as EventItem[]);
}

export async function getUpcomingPublicEvents(limit?: number) {
  const supabase = await createClient();
  const now = new Date();
  const nowIso = now.toISOString();
  const argentinaDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: ARGENTINA_TIME_ZONE,
  }).format(now);
  const argentinaDayStart = new Date(`${argentinaDay}T00:00:00-03:00`).toISOString();

  let query = supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .not("starts_at", "is", null)
    .or(
      `starts_at.gt.${nowIso},and(starts_at.lte.${nowIso},ends_at.gte.${nowIso}),and(starts_at.gte.${argentinaDayStart},starts_at.lte.${nowIso},ends_at.is.null)`,
    )
    .order("featured", { ascending: false })
    .order("starts_at", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("Unable to load upcoming public events", error);
    return [];
  }

  return (data ?? []) as EventItem[];
}
