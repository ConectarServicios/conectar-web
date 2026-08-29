import { createClient } from "@/lib/supabase/server";
import type { NewsItem } from "@/types/news";

export const NEWS_BUCKET = "news-images";
export function newsImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, path: string | null) {
  return path ? supabase.storage.from(NEWS_BUCKET).getPublicUrl(path).data.publicUrl : null;
}
export async function getPublicNews(limit?: number): Promise<NewsItem[]> {
  const supabase = await createClient();
  let query = supabase.from("news").select("id,title,slug,excerpt,content,cover_image,category,status,featured,published_at,author_id,created_at")
    .eq("status", "published").lte("published_at", new Date().toISOString())
    .order("featured", { ascending: false }).order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) { console.error("Unable to load public news", error); return []; }
  return (data ?? []) as NewsItem[];
}
