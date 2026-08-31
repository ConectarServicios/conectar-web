import { FAQ_CATEGORIES, type FaqCategory, type FaqFormValues } from "@/types/faqs";

export function isFaqCategory(value: string): value is FaqCategory {
  return (FAQ_CATEGORIES as readonly string[]).includes(value);
}

export function parseFaqForm(form: FormData): {
  data?: FaqFormValues;
  errors: Record<string, string>;
} {
  const question = String(form.get("question") ?? "").trim();
  const answer = String(form.get("answer") ?? "").trim();
  const category = String(form.get("category") ?? "");
  const orderValue = String(form.get("display_order") ?? "");
  const displayOrder = Number(orderValue);
  const errors: Record<string, string> = {};

  if (!question) errors.question = "Ingresá la pregunta.";
  if (!answer) errors.answer = "Ingresá la respuesta.";
  if (!isFaqCategory(category)) errors.category = "Elegí una categoría válida.";
  if (!/^\d+$/.test(orderValue) || !Number.isSafeInteger(displayOrder)) {
    errors.display_order = "Ingresá un número entero mayor o igual a 0.";
  }

  if (Object.keys(errors).length || !isFaqCategory(category)) return { errors };
  return {
    data: {
      question,
      answer,
      category,
      active: form.get("active") === "on",
      featured: form.get("featured") === "on",
      display_order: displayOrder,
    },
    errors,
  };
}
