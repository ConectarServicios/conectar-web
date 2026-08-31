import { createClient } from "@/lib/supabase/server";
import type { Promotion, PromotionPlacement, PromotionStatus } from "@/types/promotions";

export const PROMOTIONS_BUCKET = "promotion-images";
const fields = "id,title,slug,summary,description,image_path,button_text,button_url,starts_at,ends_at,active,featured,placements,display_order,created_at,updated_at";

export function promotionImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, path: string | null) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return supabase.storage.from(PROMOTIONS_BUCKET).getPublicUrl(path).data.publicUrl;
}

export function promotionStatus(
  item: Pick<Promotion, "active" | "starts_at" | "ends_at">,
  now = new Date(),
): PromotionStatus {
  if (!item.active) return "inactive";
  if (item.starts_at && new Date(item.starts_at) > now) return "scheduled";
  if (item.ends_at && new Date(item.ends_at) < now) return "expired";
  return "current";
}

export async function getPublicPromotions(placement?: PromotionPlacement, limit?: number) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  let query = supabase.from("promotions").select(fields)
    .eq("active", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("featured", { ascending: false })
    .order("display_order", { ascending: true })
    .order("starts_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (placement) query = query.contains("placements", [placement]);
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) {
    console.error("Unable to load public promotions", error);
    return [];
  }
  return (data ?? []) as Promotion[];
}

export async function getPublicPromotion(slug: string) {
  const items = await getPublicPromotions();
  return items.find((item) => item.slug === slug) ?? null;
}
