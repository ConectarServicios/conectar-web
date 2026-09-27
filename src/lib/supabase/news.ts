import { createClient } from "@/lib/supabase/server";
import { NEWS_ALERT_CATEGORY, type NewsItem } from "@/types/news";
import type { PublicResult } from "@/lib/supabase/public-result";

export const NEWS_BUCKET = "news-images";
export function newsImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, path: string | null) {
  return path ? supabase.storage.from(NEWS_BUCKET).getPublicUrl(path).data.publicUrl : null;
}
export async function getPublicNews(limit?: number): Promise<PublicResult<NewsItem[]>> {
  const supabase = await createClient();
  let query = supabase.from("news").select("id,title,slug,excerpt,content,cover_image,category,status,featured,published_at,alert_ends_at,author_id,created_at")
    .eq("status", "published").lte("published_at", new Date().toISOString())
    .order("featured", { ascending: false }).order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) { console.error("Unable to load public news", error); return { data: [], unavailable: true }; }
  return { data: (data ?? []) as NewsItem[], unavailable: false };
}

export async function getPublicFeaturedAlert(): Promise<PublicResult<NewsItem | null>> {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("news")
    .select("id,title,slug,excerpt,content,cover_image,category,status,featured,published_at,alert_ends_at,author_id,created_at")
    .eq("status", "published")
    .eq("featured", true)
    .eq("category", NEWS_ALERT_CATEGORY)
    .lte("published_at", now)
    .or(`alert_ends_at.is.null,alert_ends_at.gt.${now}`)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Unable to load the public featured alert", error);
    return { data: null, unavailable: true };
  }

  return { data: data as NewsItem | null, unavailable: false };
}
