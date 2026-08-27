import type { ServiceFormValues } from "@/types/services";

export type ParsedServiceForm = {
  data?: ServiceFormValues;
  errors: Record<string, string>;
};

export function slugifyServiceName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const nullableText = (formData: FormData, key: string) => text(formData, key) || null;

export function parseServiceForm(formData: FormData): ParsedServiceForm {
  const errors: Record<string, string> = {};
  const name = text(formData, "name");
  const slug = slugifyServiceName(text(formData, "slug"));
  const displayOrderRaw = text(formData, "display_order");
  const displayOrder = Number(displayOrderRaw);

  if (!name) errors.name = "Ingresá el nombre del servicio.";
  if (!slug) errors.slug = "Ingresá un slug válido.";
  if (!displayOrderRaw || !Number.isInteger(displayOrder) || displayOrder < 0) {
    errors.display_order = "Ingresá un entero mayor o igual a cero.";
  }

  if (Object.keys(errors).length) return { errors };
  return {
    errors,
    data: {
      name,
      slug,
      category: nullableText(formData, "category"),
      short_description: nullableText(formData, "short_description"),
      description: nullableText(formData, "description"),
      image_url: nullableText(formData, "image_url"),
      icon: nullableText(formData, "icon"),
      featured: formData.get("featured") === "on",
      active: formData.get("active") === "on",
      display_order: displayOrder,
    },
  };
}
