import { publicFailure } from "@/lib/supabase/public-result";
import { PUBLIC_CACHE_POLICY } from "@/lib/supabase/public-cache";
import { validList, validDetail, validNews, successful } from "@/lib/supabase/public-cache-validation";
import { publicRead } from "@/lib/supabase/public-read";
import { createPublicClient } from "@/lib/supabase/public";
import { NEWS_ALERT_CATEGORY, type NewsItem } from "@/types/news";
import type { PublicResult } from "@/lib/supabase/public-result";

export const NEWS_BUCKET = "news-images";
export function newsImageUrl(supabase: Awaited<ReturnType<typeof createPublicClient>>, path: string | null) {
  return path ? supabase.storage.from(NEWS_BUCKET).getPublicUrl(path).data.publicUrl : null;
}
export async function getPublicNews(limit?: number): Promise<PublicResult<NewsItem[]>> {
  return publicRead<PublicResult<NewsItem[]>>("getPublicNews", { data: [], unavailable: true }, async () => {
    const supabase = await createPublicClient();
    let query = supabase.from("news").select("id,title,slug,excerpt,content,cover_image,category,status,featured,published_at,alert_ends_at,content_module,author_id,created_at")
      .eq("status", "published").lte("published_at", new Date().toISOString())
      .order("featured", { ascending: false }).order("published_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error, status } = await query;
    if (error) { console.error("Unable to load public news", error); return publicFailure([], status); }
    return { data: (data ?? []) as NewsItem[], unavailable: false };
  }, { domain: "news", key: JSON.stringify(["list", limit ?? null]), policy: PUBLIC_CACHE_POLICY.editorial, valid: value => validList(value, validNews), visible: (value, now) => ({ ...value, data: value.data.filter(item => Date.parse(item.published_at!) <= now) }) });
}

export async function getPublicFeaturedAlert(): Promise<PublicResult<NewsItem | null>> {
  return publicRead<PublicResult<NewsItem | null>>("getPublicFeaturedAlert", { data: null, unavailable: true }, async () => {
    const supabase = await createPublicClient();
    const now = new Date().toISOString();
    const { data, error, status } = await supabase
      .from("news")
      .select("id,title,slug,excerpt,content,cover_image,category,status,featured,published_at,alert_ends_at,content_module,author_id,created_at")
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
      return publicFailure(null, status);
    }

    return { data: data as NewsItem | null, unavailable: false };
  }, { domain: "news", key: "alert", policy: PUBLIC_CACHE_POLICY.live, valid: successful, visible: (value, now) => ({ ...value, data: value.data && (!value.data.alert_ends_at || Date.parse(value.data.alert_ends_at) > now) ? value.data : null }) });
}

export async function getPublicNewsDetail(slug: string): Promise<PublicResult<NewsItem | null>> {
  return publicRead<PublicResult<NewsItem | null>>("getPublicNewsDetail", { data: null, unavailable: true }, async () => {
      const supabase = await createPublicClient();
      const { data, error, status } = await supabase.from("news").select("id,title,slug,excerpt,content,cover_image,category,status,featured,published_at,alert_ends_at,content_module,author_id,created_at")
        .eq("slug", slug).eq("status", "published").lte("published_at", new Date().toISOString()).maybeSingle();
      if (error) return publicFailure(null, status);
    return { data: data as NewsItem | null, unavailable: false };
  }, { domain: "news", key: JSON.stringify(["detail", slug]), policy: PUBLIC_CACHE_POLICY.editorial, valid: value => validDetail(value, validNews), visible: (value, now) => ({ ...value, data: value.data && Date.parse(value.data.published_at!) <= now ? value.data : null }) });
}
