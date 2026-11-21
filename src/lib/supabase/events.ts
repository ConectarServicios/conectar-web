import { publicFailure } from "@/lib/supabase/public-result";
import { PUBLIC_CACHE_POLICY } from "@/lib/supabase/public-cache";
import { validList, validDetail, validEvent } from "@/lib/supabase/public-cache-validation";
import { publicRead } from "@/lib/supabase/public-read";
import { createPublicClient } from "@/lib/supabase/public";
import { sortEvents, eventTemporalStatus } from "@/lib/utils/event-dates";
import { ARGENTINA_TIME_ZONE } from "@/lib/utils/news-dates";
import type { EventItem } from "@/types/events";
import type { PublicResult } from "@/lib/supabase/public-result";
import { isExternalPublicUrl } from "@/lib/utils/public-navigation-url";

export const EVENTS_BUCKET = "event-images";
export const EVENT_SELECT =
  "id,title,slug,summary,description,image_path,location,address,starts_at,ends_at,status,featured,button_text,button_url,created_at,updated_at";

export function eventImageUrl(
  supabase: Awaited<ReturnType<typeof createPublicClient>>,
  path: string | null,
) {
  if (!path) return null;
  if (isExternalPublicUrl(path)) return path;
  return supabase.storage.from(EVENTS_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function getPublicEvents(): Promise<PublicResult<EventItem[]>> {
  return publicRead<PublicResult<EventItem[]>>("getPublicEvents", { data: [], unavailable: true }, async () => {
    const supabase = await createPublicClient();
    const { data, error, status } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("status", "published");

    if (error) {
      console.error("Unable to load public events", error);
      return publicFailure([], status);
    }

    return { data: sortEvents((data ?? []) as EventItem[]), unavailable: false };
  }, { domain: "events", key: "list", policy: PUBLIC_CACHE_POLICY.editorial, valid: value => validList(value, validEvent), visible: (value, now) => ({ ...value, data: sortEvents(value.data, new Date(now)) }) });
}

export async function getUpcomingPublicEvents(limit?: number): Promise<PublicResult<EventItem[]>> {
  return publicRead<PublicResult<EventItem[]>>("getUpcomingPublicEvents", { data: [], unavailable: true }, async () => {
    const supabase = await createPublicClient();
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

    const { data, error, status } = await query;
    if (error) {
      console.error("Unable to load upcoming public events", error);
      return publicFailure([], status);
    }

    return { data: (data ?? []) as EventItem[], unavailable: false };
  }, { domain: "events", key: JSON.stringify(["upcoming", limit ?? null]), policy: PUBLIC_CACHE_POLICY.editorial, valid: value => validList(value, validEvent), visible: (value, now) => ({ ...value, data: value.data.filter(item => ["upcoming", "ongoing"].includes(eventTemporalStatus(item, new Date(now)))) }) });
}

export async function getPublicEvent(slug: string): Promise<PublicResult<EventItem | null>> {
  return publicRead<PublicResult<EventItem | null>>("getPublicEvent", { data: null, unavailable: true }, async () => {
      const supabase = await createPublicClient();
      const { data, error, status } = await supabase.from("events").select(EVENT_SELECT)
        .eq("slug", slug).eq("status", "published").maybeSingle();
      if (error) return publicFailure(null, status);
    return { data: data as EventItem | null, unavailable: false };
  }, { domain: "events", key: JSON.stringify(["detail", slug]), policy: PUBLIC_CACHE_POLICY.editorial, valid: value => validDetail(value, validEvent) });
}
