"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { EVENTS_BUCKET } from "@/lib/supabase/events";
import { createClient } from "@/lib/supabase/server";
import { parseEventForm, validateEventImage } from "@/lib/validations/events";
import type { EventActionState, EventStatus } from "@/types/events";

async function authorizedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("active,role")
    .eq("id", user.id)
    .maybeSingle();
  return profile?.active && ["editor", "admin", "super_admin"].includes(profile.role)
    ? supabase
    : null;
}

function refreshEventPaths(...slugs: (string | undefined)[]) {
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/admin/events");
  for (const slug of slugs) {
    if (slug) revalidatePath(`/eventos/${slug}`);
  }
}

function eventImagePath(file: File) {
  const extension =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  return `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
}

export async function saveEvent(
  _: EventActionState,
  form: FormData,
): Promise<EventActionState> {
  const parsed = parseEventForm(form);
  const id = String(form.get("id") ?? "");
  const imageValue = form.get("image");
  const imageFile = imageValue instanceof File ? imageValue : new File([], "");
  const imageError = validateEventImage(imageFile);
  if (imageError) parsed.errors.image = imageError;
  if (!parsed.data || Object.keys(parsed.errors).length) {
    return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };
  }

  const supabase = await authorizedClient();
  if (!supabase) return { message: "No tenés permiso para realizar esta acción." };

  let previousImage: string | null = null;
  let previousSlug = "";
  if (id) {
    const { data: current, error } = await supabase
      .from("events")
      .select("image_path,slug")
      .eq("id", id)
      .maybeSingle();
    if (error || !current) return { message: "No pudimos encontrar el evento." };
    previousImage = current.image_path;
    previousSlug = current.slug;
  }

  let uploadedImage: string | null = null;
  if (imageFile.size) {
    uploadedImage = eventImagePath(imageFile);
    const { error } = await supabase.storage
      .from(EVENTS_BUCKET)
      .upload(uploadedImage, imageFile, {
        contentType: imageFile.type,
        cacheControl: "31536000",
      });
    if (error) return { message: "No pudimos subir la imagen." };
  }

  const values = { ...parsed.data, image_path: uploadedImage ?? previousImage };
  const result = id
    ? await supabase.from("events").update(values).eq("id", id).select("id").maybeSingle()
    : await supabase.from("events").insert(values).select("id").single();

  if (result.error || !result.data) {
    if (uploadedImage) await supabase.storage.from(EVENTS_BUCKET).remove([uploadedImage]);
    const duplicateSlug = result.error?.code === "23505";
    return {
      message: duplicateSlug ? "Ese slug ya está en uso." : "No pudimos guardar el evento.",
      fieldErrors: duplicateSlug ? { slug: "Este slug ya existe." } : undefined,
    };
  }

  let cleanupFailed = false;
  if (uploadedImage && previousImage && !/^https?:\/\//.test(previousImage)) {
    cleanupFailed = Boolean(
      (await supabase.storage.from(EVENTS_BUCKET).remove([previousImage])).error,
    );
  }
  refreshEventPaths(parsed.data.slug, previousSlug);
  redirect(
    `/admin/events?success=${id ? "updated" : "created"}${cleanupFailed ? "&error=image-cleanup" : ""}`,
  );
}

export async function updateEventStatus(form: FormData) {
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "") as EventStatus;
  const supabase = await authorizedClient();
  if (!supabase || !id || !["draft", "published", "archived"].includes(status)) {
    redirect("/admin/events?error=permission");
  }
  const { data, error } = await supabase
    .from("events")
    .update({ status })
    .eq("id", id)
    .select("slug")
    .maybeSingle();
  if (error || !data) redirect("/admin/events?error=permission");
  refreshEventPaths(data.slug);
  redirect(`/admin/events?success=${status}`);
}

export async function toggleEventFeatured(form: FormData) {
  const id = String(form.get("id") ?? "");
  const featured = form.get("featured") === "true";
  const supabase = await authorizedClient();
  if (!supabase || !id) redirect("/admin/events?error=permission");
  const { data, error } = await supabase
    .from("events")
    .update({ featured })
    .eq("id", id)
    .select("slug")
    .maybeSingle();
  if (error || !data) redirect("/admin/events?error=permission");
  refreshEventPaths(data.slug);
  redirect(`/admin/events?success=${featured ? "featured" : "unfeatured"}`);
}

export async function deleteEvent(form: FormData) {
  const id = String(form.get("id") ?? "");
  const supabase = await authorizedClient();
  if (!supabase || !id) redirect("/admin/events?error=permission");

  const { data: item } = await supabase
    .from("events")
    .select("slug,image_path")
    .eq("id", id)
    .maybeSingle();
  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !data) redirect("/admin/events?error=permission");

  let cleanupFailed = false;
  if (item?.image_path && !/^https?:\/\//.test(item.image_path)) {
    cleanupFailed = Boolean(
      (await supabase.storage.from(EVENTS_BUCKET).remove([item.image_path])).error,
    );
  }
  refreshEventPaths(item?.slug);
  redirect(
    `/admin/events?success=deleted${cleanupFailed ? "&error=image-cleanup" : ""}`,
  );
}
