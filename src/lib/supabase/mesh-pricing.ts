import { createPublicClient } from "@/lib/supabase/public";
import { cache } from "react";
import { publicRead } from "@/lib/supabase/public-read";
import { PUBLIC_CACHE_POLICY } from "@/lib/supabase/public-cache";
import { successful } from "@/lib/supabase/public-cache-validation";
import type { PublicResult } from "@/lib/supabase/public-result";

import { createClient } from "@/lib/supabase/server";
import type { MeshPricing } from "@/types/mesh-pricing";

const MESH_PRICING_SELECT = "id,mode,equipment_count,price,price_label,active,display_order,updated_at";

function normalizeRows(rows: unknown[] | null): MeshPricing[] {
  return (rows ?? []).map((row) => {
    const item = row as Omit<MeshPricing, "price"> & { price: number | string };
    return { ...item, price: Number(item.price) };
  });
}

export const getPublicMeshPricing = cache(async (): Promise<MeshPricing[]> => {
  const result = await publicRead<PublicResult<MeshPricing[]>>("getPublicMeshPricing", { data: [], unavailable: true }, async () => {
    const supabase = await createPublicClient();
    const { data, error } = await supabase.from("mesh_pricing").select(MESH_PRICING_SELECT).eq("active", true)
      .order("mode", { ascending: false }).order("equipment_count", { ascending: true }).order("display_order", { ascending: true });
    return { data: error ? [] : normalizeRows(data), unavailable: Boolean(error) };
  }, { domain: "mesh", key: "pricing", policy: PUBLIC_CACHE_POLICY.live, valid: successful });
  return result.data;
});

export async function getAdminMeshPricing() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mesh_pricing")
    .select(MESH_PRICING_SELECT)
    .order("mode", { ascending: false })
    .order("equipment_count", { ascending: true });

  if (error) {
    console.error("Unable to load administrative Mesh pricing", error);
    return { data: null, unavailable: true as const };
  }
  return { data: normalizeRows(data), unavailable: false as const };
}
