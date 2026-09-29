"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { MeshPricingActionState, MeshPricingMode } from "@/types/mesh-pricing";

const OPTIONS = [
  { mode: "rental", equipmentCount: 1 },
  { mode: "rental", equipmentCount: 2 },
  { mode: "rental", equipmentCount: 3 },
  { mode: "rental", equipmentCount: 4 },
  { mode: "purchase", equipmentCount: 1 },
] as const satisfies readonly { mode: MeshPricingMode; equipmentCount: number }[];

function fieldName(mode: MeshPricingMode, equipmentCount: number) {
  return `${mode}_${equipmentCount}`;
}

export async function saveMeshPricing(
  _previous: MeshPricingActionState,
  formData: FormData,
): Promise<MeshPricingActionState> {
  const values = OPTIONS.map((option, displayOrder) => {
    const field = fieldName(option.mode, option.equipmentCount);
    const raw = String(formData.get(field) ?? "").trim().replace(",", ".");
    return { ...option, displayOrder, field, raw, price: raw === "" ? null : Number(raw) };
  });
  const fieldErrors: Record<string, string> = {};
  for (const value of values) {
    if (value.price !== null && (!Number.isFinite(value.price) || value.price < 0 || value.price > 9_999_999_999.99)) {
      fieldErrors[value.field] = "Ingresá un precio válido mayor o igual a 0.";
    } else if (value.price !== null && !/^\d+(?:[.,]\d{1,2})?$/.test(value.raw)) {
      fieldErrors[value.field] = "Usá como máximo dos decimales.";
    }
  }
  if (Object.keys(fieldErrors).length) {
    return { message: "Revisá los precios marcados.", fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: "No tenés permiso para realizar esta acción." };
  const { data: profile } = await supabase
    .from("profiles")
    .select("active,role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.active || !["editor", "admin", "super_admin"].includes(profile.role)) {
    return { message: "No tenés permiso para realizar esta acción." };
  }

  const configured = values.filter((value) => value.price !== null);
  const cleared = values.filter((value) => value.price === null);
  const operations = [
    ...(configured.length
      ? [supabase.from("mesh_pricing").upsert(
          configured.map((value) => ({
            mode: value.mode,
            equipment_count: value.equipmentCount,
            price: value.price,
            active: true,
            display_order: value.displayOrder,
          })),
          { onConflict: "mode,equipment_count" },
        )]
      : []),
    ...cleared.map((value) => supabase
      .from("mesh_pricing")
      .delete()
      .eq("mode", value.mode)
      .eq("equipment_count", value.equipmentCount)),
  ];
  const results = await Promise.all(operations);
  const failed = results.find((result) => result.error);
  if (failed?.error) {
    console.error("Unable to save Mesh pricing", failed.error);
    return { message: "No pudimos guardar los precios. Intentá nuevamente." };
  }

  revalidatePath("/admin/mesh");
  revalidatePath("/noticias/[slug]", "page");
  return { message: "Los precios se guardaron correctamente.", success: true };
}
