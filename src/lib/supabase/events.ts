import { createClient } from "@/lib/supabase/server";
import { eventTemporalStatus, sortEvents } from "@/lib/utils/event-dates";
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
  const items = (await getPublicEvents()).filter((item) =>
    ["upcoming", "ongoing"].includes(eventTemporalStatus(item)),
  );
  return limit ? items.slice(0, limit) : items;
}
