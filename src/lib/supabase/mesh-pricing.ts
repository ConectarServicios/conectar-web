import { cache } from "react";
import { unstable_rethrow } from "next/navigation";

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
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("mesh_pricing")
      .select(MESH_PRICING_SELECT)
      .eq("active", true)
      .order("mode", { ascending: false })
      .order("equipment_count", { ascending: true })
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Unable to load public Mesh pricing", error);
      return [];
    }
    return normalizeRows(data);
  } catch (error) {
    unstable_rethrow(error);
    console.error("Unable to initialize public Mesh pricing query", error);
    return [];
  }
});

export async function getAdminMeshPricing(): Promise<MeshPricing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mesh_pricing")
    .select(MESH_PRICING_SELECT)
    .order("mode", { ascending: false })
    .order("equipment_count", { ascending: true });

  if (error) {
    console.error("Unable to load administrative Mesh pricing", error);
    return [];
  }
  return normalizeRows(data);
}
