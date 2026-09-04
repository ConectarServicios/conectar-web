"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_PROJECTS_BUCKET } from "@/lib/supabase/service-projects";
import { parseServiceProjectForm, validateServiceProjectImage } from "@/lib/validations/service-projects";
import type { ServiceProjectActionState } from "@/types/service-projects";

async function authorized() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("active, role").eq("id", user.id).maybeSingle();
  return data?.active && ["editor", "admin", "super_admin"].includes(data.role) ? supabase : null;
}
function imagePath(file: File) {
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  return `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
}
function refresh(areaSlug?: string | null) {
  revalidatePath("/servicios");
  revalidatePath("/admin/services/projects");
  if (areaSlug) revalidatePath(`/servicios/${areaSlug}`);
}
async function areaSlug(supabase: NonNullable<Awaited<ReturnType<typeof authorized>>>, areaId: string) {
  const { data } = await supabase.from("service_areas").select("slug").eq("id", areaId).maybeSingle();
  return data?.slug ?? null;
}

export async function saveServiceProject(_state: ServiceProjectActionState, formData: FormData): Promise<ServiceProjectActionState> {
  const parsed = parseServiceProjectForm(formData);
  const fileValue = formData.get("image");
  const file = fileValue instanceof File ? fileValue : new File([], "");
  const imageError = validateServiceProjectImage(file);
  if (imageError) parsed.errors.image = imageError;
  if (!parsed.data || Object.keys(parsed.errors).length) return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };
  const supabase = await authorized();
  if (!supabase) return { message: "No tenés permiso para realizar esta acción." };
  const { data: area } = await supabase.from("service_areas").select("id, slug").eq("id", parsed.data.service_area_id).maybeSingle();
  if (!area) return { message: "El área seleccionada no existe.", fieldErrors: { service_area_id: "Seleccioná un área válida." } };
  if (parsed.data.service_id) {
    const { data: service } = await supabase.from("services").select("id").eq("id", parsed.data.service_id).eq("service_area_id", parsed.data.service_area_id).maybeSingle();
    if (!service) return { message: "El servicio no pertenece al área seleccionada.", fieldErrors: { service_id: "Elegí un servicio de la misma área." } };
  }
  const id = String(formData.get("id") ?? "");
  const oldImage = String(formData.get("current_image_path") ?? "") || null;
  const previousAreaId = String(formData.get("current_service_area_id") ?? "") || null;
  let uploaded: string | null = null;
  if (file.size) {
    uploaded = imagePath(file);
    const { error } = await supabase.storage.from(SERVICE_PROJECTS_BUCKET).upload(uploaded, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
    if (error) { console.error("Unable to upload service project image", error); return { message: "No pudimos subir la imagen. Verificá el formato y el tamaño." }; }
  }
  const values = { ...parsed.data, image_path: uploaded ?? oldImage };
  const result = id ? await supabase.from("service_projects").update(values).eq("id", id).select("id").maybeSingle()
    : await supabase.from("service_projects").insert(values).select("id").single();
  if (result.error || !result.data) {
    if (uploaded) await supabase.storage.from(SERVICE_PROJECTS_BUCKET).remove([uploaded]);
    console.error("Unable to persist service project", result.error);
    if (result.error?.code === "23505") return { message: "Ya existe un proyecto con ese slug.", fieldErrors: { slug: "Elegí un slug diferente." } };
    return { message: result.error?.code === "42501" ? "No tenés permiso para realizar esta acción." : "No pudimos guardar el proyecto. Intentá nuevamente." };
  }
  let cleanup = false;
  if (uploaded && oldImage && uploaded !== oldImage) {
    const { error } = await supabase.storage.from(SERVICE_PROJECTS_BUCKET).remove([oldImage]);
    cleanup = Boolean(error); if (error) console.error("Unable to remove replaced project image", error);
  }
  refresh(area.slug);
  if (previousAreaId && previousAreaId !== parsed.data.service_area_id) refresh(await areaSlug(supabase, previousAreaId));
  redirect(`/admin/services/projects?success=${id ? "updated" : "created"}${cleanup ? "&error=image-cleanup" : ""}`);
}

async function updateFlag(formData: FormData, field: "active" | "featured") {
  const supabase = await authorized(); const id = String(formData.get("id") ?? "");
  if (!supabase || !id) redirect("/admin/services/projects?error=permission");
  const value = formData.get(field) === "true";
  const { data, error } = await supabase.from("service_projects").update({ [field]: value }).eq("id", id).select("service_area_id").maybeSingle();
  if (error || !data) { console.error("Unable to update service project", error); redirect(`/admin/services/projects?error=${error?.code === "42501" || !data ? "permission" : "unexpected"}`); }
  refresh(await areaSlug(supabase, data.service_area_id));
  redirect(`/admin/services/projects?success=${field === "active" ? (value ? "activated" : "deactivated") : (value ? "featured" : "unfeatured")}`);
}
export async function toggleServiceProjectActive(formData: FormData) { return updateFlag(formData, "active"); }
export async function toggleServiceProjectFeatured(formData: FormData) { return updateFlag(formData, "featured"); }

export async function deleteServiceProject(formData: FormData) {
  const supabase = await authorized(); const id = String(formData.get("id") ?? "");
  if (!supabase || !id) redirect("/admin/services/projects?error=permission");
  const { data: item } = await supabase.from("service_projects").select("image_path, service_area_id").eq("id", id).maybeSingle();
  const { data, error } = await supabase.from("service_projects").delete().eq("id", id).select("id").maybeSingle();
  if (error || !data) { console.error("Unable to delete service project", error); redirect(`/admin/services/projects?error=${error?.code === "42501" || !data ? "permission" : "unexpected"}`); }
  let cleanup = false;
  if (item?.image_path) { const removed = await supabase.storage.from(SERVICE_PROJECTS_BUCKET).remove([item.image_path]); cleanup = Boolean(removed.error); if (removed.error) console.error("Unable to remove deleted project image", removed.error); }
  refresh(item ? await areaSlug(supabase, item.service_area_id) : null);
  redirect(`/admin/services/projects?success=deleted${cleanup ? "&error=image-cleanup" : ""}`);
}
