"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { PROMOTIONS_BUCKET } from "@/lib/supabase/promotions";
import { parsePromotionForm, validatePromotionImage } from "@/lib/validations/promotions";
import type { PromotionActionState } from "@/types/promotions";

async function authorized() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("active,role").eq("id", user.id).maybeSingle();
  return profile?.active && ["editor", "admin", "super_admin"].includes(profile.role) ? supabase : null;
}

function refresh(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/admin/promotions");
  if (slug) revalidatePath(`/promociones/${slug}`);
}

function objectPath(file: File) {
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  return `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
}

export async function savePromotion(_: PromotionActionState, form: FormData): Promise<PromotionActionState> {
  const parsed = parsePromotionForm(form);
  const id = String(form.get("id") ?? "");
  const value = form.get("image");
  const file = value instanceof File ? value : new File([], "");
  const imageError = validatePromotionImage(file);
  if (imageError) parsed.errors.image = imageError;
  if (!parsed.data || Object.keys(parsed.errors).length) {
    return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };
  }

  const supabase = await authorized();
  if (!supabase) return { message: "No tenés permiso para realizar esta acción." };

  let previousImage: string | null = null;
  let previousSlug = "";
  if (id) {
    const { data: current, error } = await supabase.from("promotions").select("image_path,slug").eq("id", id).maybeSingle();
    if (error || !current) return { message: "No pudimos encontrar la promoción a editar." };
    previousImage = current.image_path;
    previousSlug = current.slug;
  }

  let uploaded: string | null = null;
  if (file.size) {
    uploaded = objectPath(file);
    const { error } = await supabase.storage.from(PROMOTIONS_BUCKET).upload(uploaded, file, {
      contentType: file.type, cacheControl: "31536000",
    });
    if (error) return { message: "No pudimos subir la imagen." };
  }

  const values = { ...parsed.data, image_path: uploaded ?? previousImage };
  const result = id
    ? await supabase.from("promotions").update(values).eq("id", id).select("id").maybeSingle()
    : await supabase.from("promotions").insert(values).select("id").single();
  if (result.error || !result.data) {
    if (uploaded) await supabase.storage.from(PROMOTIONS_BUCKET).remove([uploaded]);
    return {
      message: result.error?.code === "23505" ? "Ese slug ya está en uso." : "No pudimos guardar la promoción.",
      fieldErrors: result.error?.code === "23505" ? { slug: "Este slug ya existe." } : undefined,
    };
  }

  let cleanup = false;
  if (uploaded && previousImage && !/^https?:\/\//.test(previousImage)) {
    cleanup = Boolean((await supabase.storage.from(PROMOTIONS_BUCKET).remove([previousImage])).error);
  }
  refresh(parsed.data.slug);
  if (previousSlug && previousSlug !== parsed.data.slug) refresh(previousSlug);
  redirect(`/admin/promotions?success=${id ? "updated" : "created"}${cleanup ? "&error=image-cleanup" : ""}`);
}

async function toggle(form: FormData, column: "active" | "featured") {
  const id = String(form.get("id") ?? "");
  const value = form.get("value") === "true";
  const supabase = await authorized();
  if (!supabase || !id) redirect("/admin/promotions?error=permission");
  const { data, error } = await supabase.from("promotions").update({ [column]: value }).eq("id", id).select("slug").maybeSingle();
  if (error || !data) redirect("/admin/promotions?error=permission");
  refresh(data.slug);
  redirect(`/admin/promotions?success=${column}-${value}`);
}

export async function togglePromotionActive(form: FormData) { return toggle(form, "active"); }
export async function togglePromotionFeatured(form: FormData) { return toggle(form, "featured"); }

export async function deletePromotion(form: FormData) {
  const id = String(form.get("id") ?? "");
  const supabase = await authorized();
  if (!supabase || !id) redirect("/admin/promotions?error=permission");
  const { data: item } = await supabase.from("promotions").select("slug,image_path").eq("id", id).maybeSingle();
  const { data, error } = await supabase.from("promotions").delete().eq("id", id).select("id").maybeSingle();
  if (error || !data) redirect("/admin/promotions?error=permission");
  let cleanup = false;
  if (item?.image_path && !/^https?:\/\//.test(item.image_path)) {
    cleanup = Boolean((await supabase.storage.from(PROMOTIONS_BUCKET).remove([item.image_path])).error);
  }
  refresh(item?.slug);
  redirect(`/admin/promotions?success=deleted${cleanup ? "&error=image-cleanup" : ""}`);
}
