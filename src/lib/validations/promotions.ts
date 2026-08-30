import { parseArgentinaDateTimeLocal } from "@/lib/utils/news-dates";
import { PROMOTION_PLACEMENTS, type PromotionFormValues, type PromotionPlacement } from "@/types/promotions";

export function normalizePromotionSlug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function validatePromotionImage(file: File) {
  if (!file.size) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "Usá una imagen JPG, PNG o WebP.";
  if (file.size > 5 * 1024 * 1024) return "La imagen no puede superar 5 MB.";
}

export function parsePromotionForm(form: FormData): { data?: PromotionFormValues; errors: Record<string, string> } {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const errors: Record<string, string> = {};
  const title = text("title");
  const slug = normalizePromotionSlug(text("slug"));
  const summary = text("summary");
  const description = text("description");
  if (!title) errors.title = "Ingresá un título.";
  if (!slug) errors.slug = "Ingresá un slug válido.";
  if (!summary) errors.summary = "Ingresá una bajada.";
  if (!description) errors.description = "Ingresá la descripción.";

  const startsRaw = text("starts_at");
  const endsRaw = text("ends_at");
  const starts_at = startsRaw ? parseArgentinaDateTimeLocal(startsRaw) : null;
  const ends_at = endsRaw ? parseArgentinaDateTimeLocal(endsRaw) : null;
  if (startsRaw && !starts_at) errors.starts_at = "Ingresá una fecha válida.";
  if (endsRaw && !ends_at) errors.ends_at = "Ingresá una fecha válida.";
  if (starts_at && ends_at && ends_at < starts_at) errors.ends_at = "La finalización debe ser posterior al inicio.";

  const display_order = Number(text("display_order") || 0);
  if (!Number.isInteger(display_order) || display_order < 0) errors.display_order = "Ingresá un entero mayor o igual a cero.";
  const placements = form.getAll("placements").map(String)
    .filter((placement): placement is PromotionPlacement => PROMOTION_PLACEMENTS.includes(placement as PromotionPlacement));
  const button_text = text("button_text") || null;
  const button_url = text("button_url") || null;
  if (button_url && !/^(https?:\/\/|\/)/.test(button_url)) errors.button_url = "Usá una URL https:// o una ruta que comience con /.";
  if (Object.keys(errors).length) return { errors };

  return {
    errors,
    data: {
      title, slug, summary, description, image_path: null, button_text, button_url,
      starts_at, ends_at, active: form.get("active") === "on", featured: form.get("featured") === "on",
      placements, display_order,
    },
  };
}
