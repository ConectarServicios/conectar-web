"use server";

import { invalidatePublicContent } from "@/lib/supabase/public-cache";

import { administrativeRead, operationErrorState, operationErrorCode } from "@/lib/supabase/operation-error";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { parseSocialLinkForm } from "@/lib/validations/social-links";
import type { SocialLinkActionState } from "@/types/social-links";

async function getAuthorizedClient() {
  const supabase = await createClient();
  const { data: { user } } = await administrativeRead(supabase.auth.getUser());
  if (!user) return null;
  const { data: profile } = await administrativeRead(supabase.from("profiles").select("active, role").eq("id", user.id).maybeSingle());
  if (!profile?.active || !["admin", "super_admin"].includes(profile.role)) return null;
  return supabase;
}

function errorMessage(code?: string) {
  if (code === "23505") return "Ya existe un enlace para esa plataforma. Editá el existente.";
  if (code === "23514") return "La plataforma o el orden no son válidos.";
  if (code === "42501" || code === "PGRST301") return "No tenés permiso para realizar esta acción.";
  return "No pudimos guardar los cambios. Intentá nuevamente.";
}

export async function saveSocialLink(_previous: SocialLinkActionState, formData: FormData): Promise<SocialLinkActionState> {
  try {
    const parsed = parseSocialLinkForm(formData);
    if (!parsed.data) return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };
    const supabase = await getAuthorizedClient();
    if (!supabase) return { message: "No tenés permiso para realizar esta acción." };
    const id = String(formData.get("id") ?? "");
    const editing = Boolean(id);
    const result = editing
      ? await supabase.from("social_links").update(parsed.data).eq("id", id).select("id").maybeSingle()
      : await supabase.from("social_links").insert(parsed.data).select("id").single();
    if (result.error || !result.data) {
      console.error("Unable to persist social link", result.error);
      return { message: errorMessage(result.error?.code) };
    }
    invalidatePublicContent("social");
    revalidatePath("/admin/social");
    revalidatePath("/", "layout");
    redirect(`/admin/social?success=${editing ? "updated" : "created"}`);
  } catch (error) {
    return operationErrorState(error);
  }
}

export async function toggleSocialLink(formData: FormData) {
  try {
    const id = String(formData.get("id") ?? "");
    const active = formData.get("active") === "true";
    const supabase = await getAuthorizedClient();
    if (!supabase || !id) redirect("/admin/social?error=permission");
    const { data, error } = await supabase.from("social_links").update({ active }).eq("id", id).select("id").maybeSingle();
    if (error || !data) {
      console.error("Unable to toggle social link", error);
      redirect(`/admin/social?error=${error?.code === "42501" || !data ? "permission" : "unexpected"}`);
    }
    invalidatePublicContent("social");
    revalidatePath("/admin/social");
    revalidatePath("/", "layout");
    redirect(`/admin/social?success=${active ? "activated" : "deactivated"}`);
  } catch (error) {
    redirect("/admin/social?error=" + operationErrorCode(error));
  }
}

export async function deleteSocialLink(formData: FormData) {
  try {
    const id = String(formData.get("id") ?? "");
    const supabase = await getAuthorizedClient();
    if (!supabase || !id) redirect("/admin/social?error=permission");
    const { data, error } = await supabase.from("social_links").delete().eq("id", id).select("id").maybeSingle();
    if (error || !data) {
      console.error("Unable to delete social link", error);
      redirect(`/admin/social?error=${error?.code === "42501" || !data ? "permission" : "unexpected"}`);
    }
    invalidatePublicContent("social");
    revalidatePath("/admin/social");
    revalidatePath("/", "layout");
    redirect("/admin/social?success=deleted");
  } catch (error) {
    redirect("/admin/social?error=" + operationErrorCode(error));
  }
}
