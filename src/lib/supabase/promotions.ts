import { PUBLIC_CACHE_POLICY } from "@/lib/supabase/public-cache";
import { successful } from "@/lib/supabase/public-cache-validation";
import { publicRead } from "@/lib/supabase/public-read";
import { createPublicClient } from "@/lib/supabase/public";
import type { Promotion, PromotionPlacement, PromotionStatus } from "@/types/promotions";
import type { PublicResult } from "@/lib/supabase/public-result";
import { isExternalPublicUrl } from "@/lib/utils/public-navigation-url";

export const PROMOTIONS_BUCKET = "promotion-images";
const fields = "id,title,slug,summary,description,image_path,button_text,button_url,starts_at,ends_at,active,featured,placements,display_order,created_at,updated_at";
const detailFields = "title,slug,summary,description,image_path,button_text,button_url,starts_at,ends_at";
type PublicPromotionDetail = Pick<
  Promotion,
  | "title"
  | "slug"
  | "summary"
  | "description"
  | "image_path"
  | "button_text"
  | "button_url"
  | "starts_at"
  | "ends_at"
>;

export function promotionImageUrl(supabase: Awaited<ReturnType<typeof createPublicClient>>, path: string | null) {
  if (!path) return null;
  if (isExternalPublicUrl(path)) return path;
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

export async function getPublicPromotions(placement?: PromotionPlacement, limit?: number): Promise<PublicResult<Promotion[]>> {
  return publicRead<PublicResult<Promotion[]>>("getPublicPromotions", { data: [], unavailable: true }, async () => {
    const supabase = await createPublicClient();
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
      return { data: [], unavailable: true };
    }
    return { data: (data ?? []) as Promotion[], unavailable: false };
  }, { domain: "promotions", key: JSON.stringify(["list", placement ?? null, limit ?? null]), policy: PUBLIC_CACHE_POLICY.live, valid: successful, visible: (value, now) => ({ ...value, data: value.data.filter(item => (!item.starts_at || Date.parse(item.starts_at) <= now) && (!item.ends_at || Date.parse(item.ends_at) >= now)) }) });
}

export async function getPublicPromotion(slug: string): Promise<PublicResult<PublicPromotionDetail | null>> {
  return publicRead<PublicResult<PublicPromotionDetail | null>>("getPublicPromotion", { data: null, unavailable: true }, async () => {
    const supabase = await createPublicClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("promotions")
      .select(detailFields)
      .eq("slug", slug)
      .eq("active", true)
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .maybeSingle();

    if (error) {
      console.error("Unable to load public promotion detail", error);
      return { data: null, unavailable: true };
    }

    return { data: data as PublicPromotionDetail | null, unavailable: false };
  }, { domain: "promotions", key: JSON.stringify(["detail", slug]), policy: PUBLIC_CACHE_POLICY.live, valid: successful, visible: (value, now) => ({ ...value, data: value.data && (!value.data.starts_at || Date.parse(value.data.starts_at) <= now) && (!value.data.ends_at || Date.parse(value.data.ends_at) >= now) ? value.data : null }) });
}
