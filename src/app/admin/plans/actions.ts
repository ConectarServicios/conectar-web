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

  const planResult = editing
    ? await supabase.from("plans").update(parsed.data).eq("id", id).select("id").maybeSingle()
    : await supabase.from("plans").insert(parsed.data).select("id").single();
  if (planResult.error || !planResult.data) {
    console.error("Unable to persist plan", planResult.error);
    return { message: databaseMessage(planResult.error?.code) };
  }

  const planId = planResult.data.id;
  if (editing) {
    const { error } = await supabase.from("plan_features").delete().eq("plan_id", planId);
    if (error) {
      console.error("Unable to replace plan features", error);
      return { message: "El plan se guardó, pero no pudimos actualizar sus características." };
    }
  }
  if (parsed.features.length) {
    const { error } = await supabase.from("plan_features").insert(parsed.features.map((feature) => ({ ...feature, plan_id: planId })));
    if (error) {
      console.error("Unable to insert plan features", error);
      return { message: "El plan se guardó, pero no pudimos guardar sus características." };
    }
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
