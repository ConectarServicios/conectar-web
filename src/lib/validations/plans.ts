import type { PlanFeature, PlanFormValues } from "@/types/plans";

export type PlanPayload = Omit<PlanFormValues, "plan_features">;

export type ParsedPlanForm = {
  data?: PlanPayload;
  features: PlanFeature[];
  errors: Record<string, string>;
};

export function slugifyPlanName(value: string) {
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

export function parsePlanForm(formData: FormData): ParsedPlanForm {
  const errors: Record<string, string> = {};
  const name = text(formData, "name");
  const slug = slugifyPlanName(text(formData, "slug"));
  const speedMbpsRaw = text(formData, "speed_mbps");
  const speedMbps = Number(speedMbpsRaw);
  const regularPriceRaw = text(formData, "regular_price");
  const regularPrice = Number(regularPriceRaw);
  const promotionalRaw = text(formData, "promotional_price");
  const promotionalPrice = promotionalRaw === "" ? null : Number(promotionalRaw);
  const displayOrderRaw = text(formData, "display_order");
  const displayOrder = Number(displayOrderRaw);
  const promotionStartRaw = text(formData, "promotion_start");
  const promotionEndRaw = text(formData, "promotion_end");
  const promotionStartDate = promotionStartRaw ? new Date(promotionStartRaw) : null;
  const promotionEndDate = promotionEndRaw ? new Date(promotionEndRaw) : null;

  if (!name) errors.name = "Ingresá el nombre del plan.";
  if (!slug) errors.slug = "Ingresá un slug válido.";
  if (!speedMbpsRaw || !Number.isInteger(speedMbps) || speedMbps <= 0) errors.speed_mbps = "Ingresá un entero mayor que cero.";
  if (!regularPriceRaw || !Number.isFinite(regularPrice) || regularPrice < 0) errors.regular_price = "Ingresá un precio mayor o igual a cero.";
  if (promotionalPrice !== null && (!Number.isFinite(promotionalPrice) || promotionalPrice < 0)) errors.promotional_price = "Ingresá un precio mayor o igual a cero, o dejalo vacío.";
  if (!displayOrderRaw || !Number.isInteger(displayOrder) || displayOrder < 0) errors.display_order = "Ingresá un entero mayor o igual a cero.";
  if (promotionStartDate && Number.isNaN(promotionStartDate.getTime())) errors.promotion_start = "Ingresá una fecha válida.";
  if (promotionEndDate && Number.isNaN(promotionEndDate.getTime())) errors.promotion_end = "Ingresá una fecha válida.";
  if (promotionStartDate && promotionEndDate && promotionEndDate < promotionStartDate) errors.promotion_end = "El fin no puede ser anterior al inicio.";

  let features: PlanFeature[] = [];
  try {
    const raw = JSON.parse(text(formData, "features") || "[]") as unknown;
    if (!Array.isArray(raw)) throw new Error();
    features = raw.flatMap((item, index) => {
      if (typeof item !== "object" || item === null) return [];
      const candidate = item as Record<string, unknown>;
      const featureText = typeof candidate.text === "string" ? candidate.text.trim() : "";
      const order = Number(candidate.display_order);
      if (!featureText || !Number.isInteger(order) || order < 0) {
        errors.features = `Revisá el texto y el orden de la característica ${index + 1}.`;
        return [];
      }
      return [{ text: featureText, display_order: order }];
    });
  } catch {
    errors.features = "No pudimos validar las características.";
  }

  if (Object.keys(errors).length) return { errors, features };
  return {
    errors,
    features,
    data: {
      name,
      slug,
      speed_mbps: speedMbps,
      description: nullableText(formData, "description"),
      regular_price: regularPrice,
      promotional_price: promotionalPrice,
      promotion_label: nullableText(formData, "promotion_label"),
      // The client converts datetime-local from the browser's actual timezone
      // to ISO before submission; no server timezone is assumed here.
      promotion_start: promotionStartDate?.toISOString() ?? null,
      promotion_end: promotionEndDate?.toISOString() ?? null,
      featured: formData.get("featured") === "on",
      active: formData.get("active") === "on",
      display_order: displayOrder,
    },
  };
}
