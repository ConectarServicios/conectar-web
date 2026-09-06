"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { parsePlanForm } from "@/lib/validations/plans";
import type { PlanActionState } from "@/types/plans";

async function getAuthorizedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("active, role").eq("id", user.id).maybeSingle();
  if (!profile?.active || !["editor", "admin", "super_admin"].includes(profile.role)) return null;
  return supabase;
}

function databaseMessage(code?: string): string {
  if (code === "23505") return "Ya existe un plan con ese slug. Elegí uno diferente.";
  if (code === "42501" || code === "PGRST301") return "No tenés permiso para realizar esta acción.";
  return "No pudimos guardar los cambios. Intentá nuevamente.";
}

export async function savePlan(previous: PlanActionState, formData: FormData): Promise<PlanActionState> {
  const parsed = parsePlanForm(formData);
  if (!parsed.data) return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };
  const supabase = await getAuthorizedClient();
  if (!supabase) return { message: "No tenés permiso para realizar esta acción." };
  const id = String(formData.get("id") ?? "");
  const editing = Boolean(id);

  const { error } = await supabase.rpc("save_plan_with_features", {
    p_id: editing ? id : null,
    p_name: parsed.data.name,
    p_slug: parsed.data.slug,
    p_speed_mbps: parsed.data.speed_mbps,
    p_upload_speed_mbps: parsed.data.upload_speed_mbps,
    p_description: parsed.data.description,
    p_regular_price: parsed.data.regular_price,
    p_promotional_price: parsed.data.promotional_price,
    p_promotion_label: parsed.data.promotion_label,
    p_promotion_start: parsed.data.promotion_start,
    p_promotion_end: parsed.data.promotion_end,
    p_featured: parsed.data.featured,
    p_active: parsed.data.active,
    p_display_order: parsed.data.display_order,
    p_features: parsed.features,
  });
  if (error) {
    console.error("Unable to persist plan and features", error);
    return { message: databaseMessage(error.code) };
  }
  revalidatePath("/admin/plans");
  redirect(`/admin/plans?success=${editing ? "updated" : "created"}`);
}

export async function togglePlanActive(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  const supabase = await getAuthorizedClient();
  if (!supabase || !id) redirect("/admin/plans?error=permission");
  const { data, error } = await supabase.from("plans").update({ active }).eq("id", id).select("id").maybeSingle();
  if (error || !data) {
    console.error("Unable to toggle plan", error);
    redirect(`/admin/plans?error=${error?.code === "42501" || !data ? "permission" : "unexpected"}`);
  }
  revalidatePath("/admin/plans");
  redirect(`/admin/plans?success=${active ? "activated" : "deactivated"}`);
}

export async function deletePlan(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await getAuthorizedClient();
  if (!supabase || !id) redirect("/admin/plans?error=permission");
  const { data, error } = await supabase.from("plans").delete().eq("id", id).select("id").maybeSingle();
  if (error || !data) {
    console.error("Unable to delete plan", error);
    redirect(`/admin/plans?error=${error?.code === "42501" || !data ? "permission" : "unexpected"}`);
  }
  revalidatePath("/admin/plans");
  redirect("/admin/plans?success=deleted");
}
