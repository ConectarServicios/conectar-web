"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { parseFaqForm } from "@/lib/validations/faqs";
import type { FaqActionState } from "@/types/faqs";

async function authorizedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles").select("active,role").eq("id", user.id).maybeSingle();
  return profile?.active && ["editor", "admin", "super_admin"].includes(profile.role)
    ? supabase
    : null;
}

function refreshFaqPaths() {
  revalidatePath("/");
  revalidatePath("/preguntas-frecuentes");
  revalidatePath("/admin/faqs");
}

export async function saveFaq(_: FaqActionState, form: FormData): Promise<FaqActionState> {
  const parsed = parseFaqForm(form);
  if (!parsed.data) return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };
  const id = String(form.get("id") ?? "");
  const supabase = await authorizedClient();
  if (!supabase) return { message: "No tenés permiso para realizar esta acción." };
  const result = id
    ? await supabase.from("faqs").update(parsed.data).eq("id", id).select("id").maybeSingle()
    : await supabase.from("faqs").insert(parsed.data).select("id").single();
  if (result.error || !result.data) return { message: "No pudimos guardar la pregunta frecuente." };
  refreshFaqPaths();
  redirect(`/admin/faqs?success=${id ? "updated" : "created"}`);
}

async function updateBoolean(form: FormData, field: "active" | "featured") {
  const id = String(form.get("id") ?? "");
  const value = form.get(field) === "true";
  const supabase = await authorizedClient();
  if (!supabase || !id) redirect("/admin/faqs?error=permission");
  const { data, error } = await supabase.from("faqs").update({ [field]: value })
    .eq("id", id).select("id").maybeSingle();
  if (error || !data) redirect("/admin/faqs?error=permission");
  refreshFaqPaths();
  redirect(`/admin/faqs?success=${field === "active" ? (value ? "activated" : "deactivated") : (value ? "featured" : "unfeatured")}`);
}

export async function toggleFaqActive(form: FormData) { await updateBoolean(form, "active"); }
export async function toggleFaqFeatured(form: FormData) { await updateBoolean(form, "featured"); }

export async function deleteFaq(form: FormData) {
  const id = String(form.get("id") ?? "");
  const supabase = await authorizedClient();
  if (!supabase || !id) redirect("/admin/faqs?error=permission");
  const { data, error } = await supabase.from("faqs").delete().eq("id", id).select("id").maybeSingle();
  if (error || !data) redirect("/admin/faqs?error=permission");
  refreshFaqPaths();
  redirect("/admin/faqs?success=deleted");
}
