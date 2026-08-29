"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { parseHeroForm, validateHeroImage } from "@/lib/validations/hero";
import type { HeroActionState } from "@/types/hero";

const BUCKET = "hero-banners";

async function getAuthorizedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("active, role").eq("id", user.id).maybeSingle();
  return profile?.active && ["admin", "super_admin"].includes(profile.role) ? supabase : null;
}

function storagePath(file: File) {
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  return `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
}

function errorMessage(code?: string) {
  if (code === "23505") return "Solo puede haber un slide principal. Desmarcá el actual e intentá nuevamente.";
  if (code === "23514") return "Solo puede haber hasta 3 slides activos. Desactivá uno e intentá nuevamente.";
  if (code === "42501" || code === "PGRST301") return "No tenés permiso para realizar esta acción.";
  return "No pudimos guardar el slide. Intentá nuevamente.";
}

export async function saveHeroSlide(previous: HeroActionState, formData: FormData): Promise<HeroActionState> {
  const parsed = parseHeroForm(formData);
  const id = String(formData.get("id") ?? "");
  const currentImagePath = String(formData.get("current_image_path") ?? "");
  const fileValue = formData.get("image");
  const file = fileValue instanceof File ? fileValue : new File([], "");
  const imageError = validateHeroImage(file, !id);
  if (imageError) parsed.errors.image = imageError;
  if (!parsed.data || Object.keys(parsed.errors).length) return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };

  const supabase = await getAuthorizedClient();
  if (!supabase) return { message: "No tenés permiso para realizar esta acción." };

  let newImagePath: string | null = null;
  if (file.size > 0) {
    newImagePath = storagePath(file);
    const { error } = await supabase.storage.from(BUCKET).upload(newImagePath, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
    if (error) {
      console.error("Unable to upload hero image", error);
      return { message: "No pudimos subir la imagen. Verificá el formato y el tamaño." };
    }
  }

  const imagePath = newImagePath ?? currentImagePath;
  if (!imagePath) return { message: "Seleccioná una imagen.", fieldErrors: { image: "Seleccioná una imagen." } };

  if (parsed.data.featured) {
    const query = supabase.from("hero_slides").update({ featured: false }).eq("featured", true);
    const { error } = id ? await query.neq("id", id) : await query;
    if (error) {
      if (newImagePath) await supabase.storage.from(BUCKET).remove([newImagePath]);
      return { message: errorMessage(error.code) };
    }
  }

  const values = { ...parsed.data, image_path: imagePath };
  const result = id
    ? await supabase.from("hero_slides").update(values).eq("id", id).select("id").maybeSingle()
    : await supabase.from("hero_slides").insert(values).select("id").single();
  if (result.error || !result.data) {
    if (newImagePath) await supabase.storage.from(BUCKET).remove([newImagePath]);
    console.error("Unable to persist hero slide", result.error);
    return { message: errorMessage(result.error?.code) };
  }

  let cleanupFailed = false;
  if (newImagePath && currentImagePath && currentImagePath !== newImagePath) {
    const { error } = await supabase.storage.from(BUCKET).remove([currentImagePath]);
    if (error) { cleanupFailed = true; console.error("Unable to remove replaced hero image", error); }
  }
  revalidatePath("/");
  revalidatePath("/admin/hero");
  redirect(`/admin/hero?success=${id ? "updated" : "created"}${cleanupFailed ? "&error=image-cleanup" : ""}`);
}

export async function toggleHeroSlide(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  const supabase = await getAuthorizedClient();
  if (!supabase || !id) redirect("/admin/hero?error=permission");
  const { data, error } = await supabase.from("hero_slides").update({ active }).eq("id", id).select("id").maybeSingle();
  if (error || !data) redirect(`/admin/hero?error=${error?.code === "23514" ? "active-limit" : error?.code === "42501" || !data ? "permission" : "unexpected"}`);
  revalidatePath("/"); revalidatePath("/admin/hero");
  redirect(`/admin/hero?success=${active ? "activated" : "deactivated"}`);
}

export async function featureHeroSlide(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await getAuthorizedClient();
  if (!supabase || !id) redirect("/admin/hero?error=permission");
  const { error: clearError } = await supabase.from("hero_slides").update({ featured: false }).eq("featured", true).neq("id", id);
  const { data, error } = clearError ? { data: null, error: clearError } : await supabase.from("hero_slides").update({ featured: true }).eq("id", id).select("id").maybeSingle();
  if (error || !data) redirect(`/admin/hero?error=${error?.code === "42501" || !data ? "permission" : "unexpected"}`);
  revalidatePath("/"); revalidatePath("/admin/hero");
  redirect("/admin/hero?success=featured");
}

export async function deleteHeroSlide(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await getAuthorizedClient();
  if (!supabase || !id) redirect("/admin/hero?error=permission");
  const { data: slide } = await supabase.from("hero_slides").select("image_path").eq("id", id).maybeSingle();
  const { data, error } = await supabase.from("hero_slides").delete().eq("id", id).select("id").maybeSingle();
  if (error || !data) redirect(`/admin/hero?error=${error?.code === "42501" || !data ? "permission" : "unexpected"}`);
  let cleanupFailed = false;
  if (slide?.image_path) {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([slide.image_path]);
    if (storageError) { cleanupFailed = true; console.error("Unable to remove deleted hero image", storageError); }
  }
  revalidatePath("/"); revalidatePath("/admin/hero");
  redirect(`/admin/hero?success=deleted${cleanupFailed ? "&error=image-cleanup" : ""}`);
}
