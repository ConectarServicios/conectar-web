import type { ServiceProjectFormValues } from "@/types/service-projects";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const INTERNAL_URL = /^\/(?:[^/\s][^\s]*)?$/;
const ALLOWED_IMAGES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
const nullable = (data: FormData, key: string) => text(data, key) || null;

export function normalizeProjectSlug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function isSafeProjectUrl(value: string) {
  if (INTERNAL_URL.test(value)) return true;
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function validateServiceProjectImage(file: File) {
  if (!file.size) return null;
  if (!ALLOWED_IMAGES.has(file.type)) return "Seleccioná una imagen JPG, PNG o WebP.";
  if (file.size > MAX_IMAGE_SIZE) return "La imagen no puede superar los 5 MB.";
  return null;
}

export function parseServiceProjectForm(formData: FormData): { data?: ServiceProjectFormValues; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const title = text(formData, "title");
  const slug = text(formData, "slug");
  const service_area_id = text(formData, "service_area_id");
  const service_id = nullable(formData, "service_id");
  const project_type = nullable(formData, "project_type");
  const public_url = nullable(formData, "public_url");
  const orderRaw = text(formData, "display_order");
  const display_order = Number(orderRaw);
  if (!title) errors.title = "Ingresá el título.";
  if (!SLUG.test(slug) || normalizeProjectSlug(slug) !== slug) errors.slug = "Usá solo minúsculas, números y guiones.";
  if (!UUID.test(service_area_id)) errors.service_area_id = "Seleccioná un área válida.";
  if (service_id && !UUID.test(service_id)) errors.service_id = "Seleccioná un servicio válido.";
  if (project_type && project_type.length > 80) errors.project_type = "Usá hasta 80 caracteres.";
  if (public_url && !isSafeProjectUrl(public_url)) errors.public_url = "Usá una ruta interna o una URL http/https segura.";
  if (!orderRaw || !Number.isInteger(display_order) || display_order < 0) errors.display_order = "Ingresá un entero mayor o igual a cero.";
  if (Object.keys(errors).length) return { errors };
  return { errors: {}, data: { title, slug, service_area_id, service_id, project_type,
    short_description: nullable(formData, "short_description"), description: nullable(formData, "description"),
    image_path: null, public_url, featured: formData.get("featured") === "on",
    active: formData.get("active") === "on", display_order } };
}
