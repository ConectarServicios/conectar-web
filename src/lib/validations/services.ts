import type { ServiceAreaFormValues, ServiceFormValues } from "@/types/services";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_URL = /^(\/[^/]|\/$|https?:\/\/)/i;
const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const nullableText = (formData: FormData, key: string) => text(formData, key) || null;

export function slugifyServiceName(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
}

function common(formData: FormData) {
  const errors: Record<string, string> = {};
  const name = text(formData, "name");
  const rawSlug = text(formData, "slug");
  const slug = slugifyServiceName(rawSlug);
  const displayOrderRaw = text(formData, "display_order");
  const display_order = Number(displayOrderRaw);
  if (!name) errors.name = "Ingresá el nombre.";
  if (!rawSlug || slug !== rawSlug) errors.slug = "Usá solo minúsculas, números y guiones.";
  if (!displayOrderRaw || !Number.isInteger(display_order) || display_order < 0) errors.display_order = "Ingresá un entero mayor o igual a cero.";
  return { errors, name, slug, display_order };
}

export function parseServiceForm(formData: FormData): { data?: ServiceFormValues; errors: Record<string, string> } {
  const result = common(formData);
  const service_area_id = text(formData, "service_area_id");
  if (!UUID.test(service_area_id)) result.errors.service_area_id = "Seleccioná un área de servicio.";
  if (Object.keys(result.errors).length) return { errors: result.errors };
  return { errors: {}, data: {
    name: result.name, slug: result.slug, service_area_id,
    short_description: nullableText(formData, "short_description"), description: nullableText(formData, "description"),
    image_url: nullableText(formData, "image_url"), icon: nullableText(formData, "icon"),
    featured: formData.get("featured") === "on", active: formData.get("active") === "on", display_order: result.display_order,
  } };
}

export function parseServiceAreaForm(formData: FormData): { data?: ServiceAreaFormValues; errors: Record<string, string> } {
  const result = common(formData);
  const public_url = nullableText(formData, "public_url");
  if (public_url && !SAFE_URL.test(public_url)) result.errors.public_url = "Usá una ruta interna o una URL http/https segura.";
  if (Object.keys(result.errors).length) return { errors: result.errors };
  return { errors: {}, data: {
    name: result.name, slug: result.slug, short_description: nullableText(formData, "short_description"),
    description: nullableText(formData, "description"), icon: nullableText(formData, "icon"), public_url,
    featured: formData.get("featured") === "on", active: formData.get("active") === "on", display_order: result.display_order,
  } };
}
