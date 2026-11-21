import { createPublicClient } from "@/lib/supabase/public";
import { publicRead } from "@/lib/supabase/public-read";

type SitemapRecord = {
  slug: string;
  updated_at: string | null;
};

export async function getPublicContentSitemapRecords() {
  return publicRead("getPublicContentSitemapRecords", { news: [] as SitemapRecord[], events: [] as SitemapRecord[], promotions: [] as SitemapRecord[] }, async () => {
    const supabase = await createPublicClient();
    const now = new Date().toISOString();

    const [news, events, promotions] = await Promise.all([
      supabase
        .from("news")
        .select("slug,updated_at")
        .eq("status", "published")
        .lte("published_at", now),
      supabase
        .from("events")
        .select("slug,updated_at")
        .eq("status", "published"),
      supabase
        .from("promotions")
        .select("slug,updated_at")
        .eq("active", true)
        .or(`starts_at.is.null,starts_at.lte.${now}`)
        .or(`ends_at.is.null,ends_at.gte.${now}`),
    ]);

    const result = {
      news: [] as SitemapRecord[],
      events: [] as SitemapRecord[],
      promotions: [] as SitemapRecord[],
    };
    const entries = [news, events, promotions] as const;
    const keys = ["news", "events", "promotions"] as const;

    entries.forEach((entry, index) => {
      if (entry.error) {
        console.error(`Unable to load public sitemap ${keys[index]}`, entry.error);
        return;
      }
      result[keys[index]] = (entry.data ?? []) as SitemapRecord[];
    });

    return result;
  });
}
