import { NEWS_CATEGORIES, NEWS_STATUSES, type NewsFormValues } from "@/types/news";
import { parseArgentinaDateTimeLocal } from "@/lib/utils/news-dates";

export const NEWS_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const NEWS_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const NEWS_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeNewsSlug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function validateNewsImage(file: File) {
  if (!file.size) return undefined;
  if (!NEWS_IMAGE_TYPES.includes(file.type)) return "Usá una imagen JPG, PNG o WebP.";
  if (file.size > NEWS_IMAGE_MAX_BYTES) return "La imagen no puede superar los 5 MB.";
}

export function parseNewsForm(formData: FormData): { data?: NewsFormValues; errors: Record<string, string> } {
  const title = String(formData.get("title") ?? "").trim();
  const slug = normalizeNewsSlug(String(formData.get("slug") ?? ""));
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const status = String(formData.get("status") ?? "draft");
  const rawDate = String(formData.get("published_at") ?? "").trim();
  const errors: Record<string, string> = {};
  if (!title) errors.title = "Ingresá un título.";
  if (!slug) errors.slug = "Ingresá un slug.";
  else if (!NEWS_SLUG_PATTERN.test(slug)) errors.slug = "Usá solo minúsculas, números y guiones.";
  if (!content) errors.content = "Ingresá el contenido.";
  if (!NEWS_CATEGORIES.includes(category as (typeof NEWS_CATEGORIES)[number])) errors.category = "Elegí una categoría válida.";
  if (!NEWS_STATUSES.includes(status as (typeof NEWS_STATUSES)[number])) errors.status = "Elegí un estado válido.";
  let publishedAt: string | null = null;
  if (rawDate) {
    publishedAt = parseArgentinaDateTimeLocal(rawDate);
    if (!publishedAt) errors.published_at = "Ingresá una fecha válida.";
  }
  if (Object.keys(errors).length) return { errors };
  return { errors, data: { title, slug, excerpt, content, cover_image: null, category, status: status as NewsFormValues["status"], featured: formData.get("featured") === "on", published_at: publishedAt } };
}
