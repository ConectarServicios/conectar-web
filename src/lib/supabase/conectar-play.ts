import { publicFailure } from "@/lib/supabase/public-result";
import { PUBLIC_CACHE_POLICY } from "@/lib/supabase/public-cache";
import { validList, validFaq, successful } from "@/lib/supabase/public-cache-validation";
import { publicRead } from "@/lib/supabase/public-read";
import { createPublicClient } from "@/lib/supabase/public";
import type { ConectarPlayFaq, ConectarPlayPack, ConectarPlayPlan, ConectarPlaySettings } from "@/types/conectar-play";
import type { PublicResult } from "@/lib/supabase/public-result";

export async function getPlaySettings(): Promise<PublicResult<ConectarPlaySettings | null>> {
  return publicRead<PublicResult<ConectarPlaySettings | null>>("getPlaySettings", { data: null, unavailable: true }, async () => {
    const supabase = await createPublicClient();
    const { data, error, status } = await supabase.from("conectar_play_settings").select("*").eq("active", true).maybeSingle();
    if (error) console.error("Unable to load public Conectar Play settings", error);
    if (error) return publicFailure(null, status);
    return { data: data as ConectarPlaySettings | null, unavailable: false };
  }, { domain: "play", key: "settings", policy: PUBLIC_CACHE_POLICY.live, valid: successful });
}
export async function getPlayPlans(): Promise<PublicResult<ConectarPlayPlan[]>> {
  return publicRead<PublicResult<ConectarPlayPlan[]>>("getPlayPlans", { data: [], unavailable: true }, async () => {
    const supabase = await createPublicClient();
    const { data, error, status } = await supabase.from("conectar_play_plans").select("*").eq("active", true).order("display_order").order("name");
    if (error) console.error("Unable to load public Conectar Play plans", error);
    if (error) return publicFailure([], status);
    return { data: data as ConectarPlayPlan[], unavailable: false };
  }, { domain: "play", key: "plans", policy: PUBLIC_CACHE_POLICY.live, valid: successful });
}
export async function getPlayPacks(): Promise<PublicResult<ConectarPlayPack[]>> {
  return publicRead<PublicResult<ConectarPlayPack[]>>("getPlayPacks", { data: [], unavailable: true }, async () => {
    const supabase = await createPublicClient();
    const { data, error, status } = await supabase.from("conectar_play_packs").select("*").eq("active", true).order("display_order").order("name");
    if (error) console.error("Unable to load public Conectar Play packs", error);
    if (error) return publicFailure([], status);
    return { data: data as ConectarPlayPack[], unavailable: false };
  }, { domain: "play", key: "packs", policy: PUBLIC_CACHE_POLICY.live, valid: successful });
}
export async function getPlayFaqs(): Promise<PublicResult<ConectarPlayFaq[]>> {
  return publicRead<PublicResult<ConectarPlayFaq[]>>("getPlayFaqs", { data: [], unavailable: true }, async () => {
    const supabase = await createPublicClient();
    const { data, error, status } = await supabase.from("conectar_play_faqs").select("id,question,answer,active,display_order").eq("active", true).order("display_order").order("question");
    if (error) console.error("Unable to load public Conectar Play FAQs", error);
    if (error) return publicFailure([], status);
    return { data: data as ConectarPlayFaq[], unavailable: false };
  }, { domain: "play", key: "faqs", policy: PUBLIC_CACHE_POLICY.information, valid: value => validList(value, validFaq) });
}
