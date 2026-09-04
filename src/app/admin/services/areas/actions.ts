"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseServiceAreaForm } from "@/lib/validations/services";
import type { ServiceActionState } from "@/types/services";

async function authorizedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("active, role").eq("id", user.id).maybeSingle();
  return data?.active && ["editor", "admin", "super_admin"].includes(data.role) ? supabase : null;
}

export async function saveServiceArea(_state: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  const parsed = parseServiceAreaForm(formData);
  if (!parsed.data) return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };
  const supabase = await authorizedClient();
  if (!supabase) return { message: "No tenés permiso para realizar esta acción." };
  const id = String(formData.get("id") ?? "");
  const result = id ? await supabase.from("service_areas").update(parsed.data).eq("id", id).select("id").maybeSingle()
    : await supabase.from("service_areas").insert(parsed.data).select("id").single();
  if (result.error || !result.data) {
    if (result.error?.code === "23505") return { message: "Ya existe un área con ese slug.", fieldErrors: { slug: "Elegí un slug diferente." } };
    console.error("Unable to persist service area", result.error);
    return { message: "No pudimos guardar el área. Intentá nuevamente." };
  }
  revalidatePath("/"); revalidatePath("/servicios"); revalidatePath("/admin/services/areas");
  redirect(`/admin/services/areas?success=${id ? "updated" : "created"}`);
}

export async function toggleServiceAreaActive(formData: FormData) {
  const supabase = await authorizedClient();
  const id = String(formData.get("id") ?? "");
  if (!supabase || !id) redirect("/admin/services/areas?error=permission");
  const active = formData.get("active") === "true";
  const { error } = await supabase.from("service_areas").update({ active }).eq("id", id);
  if (error) redirect("/admin/services/areas?error=unexpected");
  revalidatePath("/"); revalidatePath("/servicios"); revalidatePath("/admin/services/areas");
  redirect(`/admin/services/areas?success=${active ? "activated" : "deactivated"}`);
}

export async function deleteServiceArea(formData: FormData) {
  const supabase = await authorizedClient();
  const id = String(formData.get("id") ?? "");
  if (!supabase || !id) redirect("/admin/services/areas?error=permission");
  const { error } = await supabase.from("service_areas").delete().eq("id", id);
  if (error) {
    console.error("Unable to delete service area", error);
    redirect(`/admin/services/areas?error=${error.code === "23503" ? "has-dependencies" : "unexpected"}`);
  }
  revalidatePath("/"); revalidatePath("/servicios"); revalidatePath("/admin/services/areas");
  redirect("/admin/services/areas?success=deleted");
}
