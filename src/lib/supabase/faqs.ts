import { createClient } from "@/lib/supabase/server";
import type { FaqItem } from "@/types/faqs";
import type { PublicResult } from "@/lib/supabase/public-result";

export const FAQ_SELECT =
  "id,question,answer,category,active,featured,display_order,created_at,updated_at";

export async function getPublicFaqs(): Promise<PublicResult<FaqItem[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select(FAQ_SELECT)
    .eq("active", true)
    .order("category")
    .order("display_order")
    .order("question");
  if (error) {
    console.error("Unable to load public FAQs", error);
    return { data: [], unavailable: true };
  }
  return { data: (data ?? []) as FaqItem[], unavailable: false };
}

export async function getFeaturedFaqs(limit = 6): Promise<PublicResult<FaqItem[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select(FAQ_SELECT)
    .eq("active", true)
    .eq("featured", true)
    .order("display_order")
    .order("created_at")
    .limit(limit);
  if (error) {
    console.error("Unable to load featured FAQs", error);
    return { data: [], unavailable: true };
  }
  return { data: (data ?? []) as FaqItem[], unavailable: false };
}
