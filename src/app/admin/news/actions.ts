"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NEWS_BUCKET } from "@/lib/supabase/news";
import { parseNewsForm, validateNewsImage } from "@/lib/validations/news";
import type { NewsActionState, NewsStatus } from "@/types/news";

async function authorized() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("active,role").eq("id", user.id).maybeSingle();
  return profile?.active && ["editor", "admin", "super_admin"].includes(profile.role) ? { supabase, user } : null;
}
function objectPath(file: File) {
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  return `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
}
function dbMessage(code?: string) {
  if (code === "23505") return "Ese slug ya está en uso. Elegí otro.";
  if (code === "42501" || code === "PGRST301") return "No tenés permiso para realizar esta acción.";
  return "No pudimos guardar la noticia. Intentá nuevamente.";
}
function refresh() { revalidatePath("/"); revalidatePath("/noticias"); revalidatePath("/admin/news"); }

export async function saveNews(previous: NewsActionState, formData: FormData): Promise<NewsActionState> {
  const parsed = parseNewsForm(formData);
  const id = String(formData.get("id") ?? "");
  const oldImage = String(formData.get("current_cover_image") ?? "") || null;
  const value = formData.get("cover_image");
  const file = value instanceof File ? value : new File([], "");
  const imageError = validateNewsImage(file);
  if (imageError) parsed.errors.cover_image = imageError;
  if (!parsed.data || Object.keys(parsed.errors).length) return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };
  const auth = await authorized();
  if (!auth) return { message: "No tenés permiso para realizar esta acción." };
  let uploaded: string | null = null;
  if (file.size) {
    uploaded = objectPath(file);
    const { error } = await auth.supabase.storage.from(NEWS_BUCKET).upload(uploaded, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
    if (error) return { message: "No pudimos subir la imagen. Verificá el formato y el tamaño." };
  }
  const published_at = parsed.data.status === "published" && !parsed.data.published_at ? new Date().toISOString() : parsed.data.published_at;
  const values = { ...parsed.data, published_at, cover_image: uploaded ?? oldImage };
  const result = id
    ? await auth.supabase.from("news").update(values).eq("id", id).select("id").maybeSingle()
    : await auth.supabase.from("news").insert({ ...values, author_id: auth.user.id }).select("id").single();
  if (result.error || !result.data) {
    if (uploaded) await auth.supabase.storage.from(NEWS_BUCKET).remove([uploaded]);
    return { message: dbMessage(result.error?.code), fieldErrors: result.error?.code === "23505" ? { slug: "Este slug ya existe." } : undefined };
  }
  let cleanup = false;
  if (uploaded && oldImage && uploaded !== oldImage) {
    const { error } = await auth.supabase.storage.from(NEWS_BUCKET).remove([oldImage]); cleanup = Boolean(error);
  }
  refresh();
  redirect(`/admin/news?success=${id ? "updated" : "created"}${cleanup ? "&error=image-cleanup" : ""}`);
}

export async function updateNewsState(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as NewsStatus;
  const auth = await authorized();
  if (!auth || !id || !["draft", "published", "archived"].includes(status)) redirect("/admin/news?error=permission");
  const values: { status: NewsStatus; published_at?: string } = { status };
  if (status === "published") {
    const { data } = await auth.supabase.from("news").select("published_at").eq("id", id).maybeSingle();
    if (!data?.published_at) values.published_at = new Date().toISOString();
  }
  const { data, error } = await auth.supabase.from("news").update(values).eq("id", id).select("id").maybeSingle();
  if (error || !data) redirect("/admin/news?error=permission");
  refresh(); redirect(`/admin/news?success=${status}`);
}
export async function toggleNewsFeatured(formData: FormData) {
  const id = String(formData.get("id") ?? ""); const featured = formData.get("featured") === "true"; const auth = await authorized();
  if (!auth || !id) redirect("/admin/news?error=permission");
  const { data, error } = await auth.supabase.from("news").update({ featured }).eq("id", id).select("id").maybeSingle();
  if (error || !data) redirect("/admin/news?error=permission"); refresh(); redirect(`/admin/news?success=${featured ? "featured" : "unfeatured"}`);
}
export async function deleteNews(formData: FormData) {
  const id = String(formData.get("id") ?? ""); const auth = await authorized();
  if (!auth || !id) redirect("/admin/news?error=permission");
  const { data: item } = await auth.supabase.from("news").select("cover_image").eq("id", id).maybeSingle();
  const { data, error } = await auth.supabase.from("news").delete().eq("id", id).select("id").maybeSingle();
  if (error || !data) redirect("/admin/news?error=permission");
  let cleanup = false; if (item?.cover_image) { const result = await auth.supabase.storage.from(NEWS_BUCKET).remove([item.cover_image]); cleanup = Boolean(result.error); }
  refresh(); redirect(`/admin/news?success=deleted${cleanup ? "&error=image-cleanup" : ""}`);
}
