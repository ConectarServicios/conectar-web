import type { HeroSlideFormValues } from "@/types/hero";

export const HERO_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const HERO_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export function isValidHeroUrl(value: string) {
  if (/^\/\S*$/.test(value)) return true;
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function parseHeroForm(formData: FormData): { data?: Omit<HeroSlideFormValues, "image_path">; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const buttonText = String(formData.get("button_text") ?? "").trim() || null;
  const buttonUrl = String(formData.get("button_url") ?? "").trim() || null;
  const rawOrder = String(formData.get("display_order") ?? "");
  const displayOrder = Number(rawOrder);
  if (!title) errors.title = "Ingresá un título.";
  if (!Number.isInteger(displayOrder) || displayOrder < 0) errors.display_order = "El orden debe ser un entero mayor o igual a 0.";
  if (buttonText && !buttonUrl) errors.button_url = "Ingresá una URL para el botón.";
  if (buttonUrl && !isValidHeroUrl(buttonUrl)) errors.button_url = "Usá una ruta interna que comience con / o una URL http/https válida.";
  return { errors, data: Object.keys(errors).length ? undefined : { title, subtitle, button_text: buttonText, button_url: buttonUrl, active: formData.get("active") === "on", featured: formData.get("featured") === "on", display_order: displayOrder } };
}

export function validateHeroImage(file: File, required: boolean): string | null {
  if (file.size === 0) return required ? "Seleccioná una imagen." : null;
  if (!HERO_IMAGE_TYPES.includes(file.type as (typeof HERO_IMAGE_TYPES)[number])) return "La imagen debe ser JPG, PNG o WebP.";
  if (file.size > HERO_IMAGE_MAX_BYTES) return "La imagen no puede superar los 5 MB.";
  return null;
}
