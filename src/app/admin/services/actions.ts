"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { parseServiceForm } from "@/lib/validations/services";
import type { ServiceActionState } from "@/types/services";

async function getAuthorizedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("active, role").eq("id", user.id).maybeSingle();
  if (!profile?.active || !["editor", "admin", "super_admin"].includes(profile.role)) return null;
  return supabase;
}

function saveErrorMessage(code?: string) {
  if (code === "23505") return "Ya existe un servicio con ese slug. Elegí uno diferente.";
  if (code === "42501" || code === "PGRST301") return "No tenés permiso para realizar esta acción.";
  return "No pudimos guardar los cambios. Intentá nuevamente.";
}

export async function saveService(_previous: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  const parsed = parseServiceForm(formData);
  if (!parsed.data) return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };
  const supabase = await getAuthorizedClient();
  if (!supabase) return { message: "No tenés permiso para realizar esta acción." };
  const id = String(formData.get("id") ?? "");
  const editing = Boolean(id);
  const { data: area } = await supabase.from("service_areas").select("id").eq("id", parsed.data.service_area_id).maybeSingle();
  if (!area) return { message: "El área seleccionada no existe o no está disponible.", fieldErrors: { service_area_id: "Seleccioná un área válida." } };
  const result = editing
    ? await supabase.from("services").update(parsed.data).eq("id", id).select("id").maybeSingle()
    : await supabase.from("services").insert(parsed.data).select("id").single();
  if (result.error || !result.data) {
    console.error("Unable to persist service", result.error);
    return { message: saveErrorMessage(result.error?.code) };
  }
  revalidatePath("/admin/services");
  revalidatePath("/servicios");
  revalidatePath("/");
  redirect(`/admin/services?success=${editing ? "updated" : "created"}`);
}

export async function toggleServiceActive(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  const supabase = await getAuthorizedClient();
  if (!supabase || !id) redirect("/admin/services?error=permission");
  const { data, error } = await supabase.from("services").update({ active }).eq("id", id).select("id").maybeSingle();
  if (error || !data) {
    console.error("Unable to toggle service", error);
    redirect(`/admin/services?error=${error?.code === "42501" || !data ? "permission" : "unexpected"}`);
  }
  revalidatePath("/admin/services");
  redirect(`/admin/services?success=${active ? "activated" : "deactivated"}`);
}

export async function deleteService(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await getAuthorizedClient();
  if (!supabase || !id) redirect("/admin/services?error=permission");
  const { data, error } = await supabase.from("services").delete().eq("id", id).select("id").maybeSingle();
  if (error || !data) {
    console.error("Unable to delete service", error);
    redirect(`/admin/services?error=${error?.code === "42501" || !data ? "permission" : "unexpected"}`);
  }
  revalidatePath("/admin/services");
  redirect("/admin/services?success=deleted");
}
