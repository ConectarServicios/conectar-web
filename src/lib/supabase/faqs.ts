import { publicFailure } from "@/lib/supabase/public-result";
import { PUBLIC_CACHE_POLICY } from "@/lib/supabase/public-cache";
import { validList, validGeneralFaq } from "@/lib/supabase/public-cache-validation";
import { publicRead } from "@/lib/supabase/public-read";
import { createPublicClient } from "@/lib/supabase/public";
import type { FaqItem } from "@/types/faqs";
import type { PublicResult } from "@/lib/supabase/public-result";

export const FAQ_SELECT =
  "id,question,answer,category,active,featured,display_order,created_at,updated_at";

export async function getPublicFaqs(): Promise<PublicResult<FaqItem[]>> {
  return publicRead<PublicResult<FaqItem[]>>("getPublicFaqs", { data: [], unavailable: true }, async () => {
    const supabase = await createPublicClient();
    const { data, error, status } = await supabase
      .from("faqs")
      .select(FAQ_SELECT)
      .eq("active", true)
      .order("category")
      .order("display_order")
      .order("question");
    if (error) {
      console.error("Unable to load public FAQs", error);
      return publicFailure([], status);
    }
    return { data: (data ?? []) as FaqItem[], unavailable: false };
  }, { domain: "faqs", key: "all", policy: PUBLIC_CACHE_POLICY.information, valid: value => validList(value, validGeneralFaq) });
}

export async function getFeaturedFaqs(limit = 6): Promise<PublicResult<FaqItem[]>> {
  return publicRead<PublicResult<FaqItem[]>>("getFeaturedFaqs", { data: [], unavailable: true }, async () => {
    const supabase = await createPublicClient();
    const { data, error, status } = await supabase
      .from("faqs")
      .select(FAQ_SELECT)
      .eq("active", true)
      .eq("featured", true)
      .order("display_order")
      .order("created_at")
      .limit(limit);
    if (error) {
      console.error("Unable to load featured FAQs", error);
      return publicFailure([], status);
    }
    return { data: (data ?? []) as FaqItem[], unavailable: false };
  }, { domain: "faqs", key: JSON.stringify(["featured", limit]), policy: PUBLIC_CACHE_POLICY.information, valid: value => validList(value, validGeneralFaq) });
}
