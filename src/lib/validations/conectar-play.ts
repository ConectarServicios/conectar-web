import type { ConectarPlayFaq, ConectarPlayPack, ConectarPlayPlan, ConectarPlaySettings } from "@/types/conectar-play";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const nullable = (form: FormData, key: string) => text(form, key) || null;
const optionalNumber = (form: FormData, key: string, errors: Record<string, string>, options: { integer?: boolean; max?: number } = {}) => {
  const raw = text(form, key); if (!raw) return null; const value = Number(raw);
  if (!Number.isFinite(value) || value < 0 || (options.integer && !Number.isInteger(value)) || (options.max !== undefined && value > options.max)) errors[key] = "Ingresá un valor válido.";
  return value;
};
export const slugifyPlayPlan = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function parsePlaySettings(form: FormData) {
  const errors: Record<string, string> = {}; const channel = Number(text(form, "channel_count")); const devices = Number(text(form, "simultaneous_devices"));
  if (!Number.isInteger(channel) || channel <= 0) errors.channel_count = "Ingresá un entero mayor que cero.";
  if (!Number.isInteger(devices) || devices <= 0) errors.simultaneous_devices = "Ingresá un entero mayor que cero.";
  const sale = optionalNumber(form, "onn_sale_price", errors); const rental = optionalNumber(form, "onn_rental_price", errors);
  try { const url = nullable(form, "web_url"); if (url) new URL(url); } catch { errors.web_url = "Ingresá una URL válida."; }
  if (Object.keys(errors).length) return { errors };
  const data: Omit<ConectarPlaySettings, "id"> = { active: form.get("active") === "on", channel_count: channel, simultaneous_devices: devices, web_url: nullable(form, "web_url"), short_description: nullable(form, "short_description"), compatibility_text: nullable(form, "compatibility_text"), incompatible_tv_text: nullable(form, "incompatible_tv_text"), onn_enabled: form.get("onn_enabled") === "on", onn_sale_price: sale, onn_rental_price: rental, onn_description: nullable(form, "onn_description"), support_text: nullable(form, "support_text") };
  return { errors, data };
}

export function parsePlayPlan(form: FormData) {
  const errors: Record<string, string> = {}; const name = text(form, "name"); const slug = slugifyPlayPlan(text(form, "slug"));
  const price = optionalNumber(form, "promotional_price", errors); const discount = optionalNumber(form, "promotion_discount_percent", errors, { max: 100 }); const duration = optionalNumber(form, "promotion_duration_months", errors, { integer: true }); const order = optionalNumber(form, "display_order", errors, { integer: true });
  if (!name) errors.name = "Ingresá el nombre."; if (!slug) errors.slug = "Ingresá un slug válido."; if (price === null) errors.promotional_price = "Ingresá el precio promocional."; if (duration !== null && duration <= 0) errors.promotion_duration_months = "Debe ser mayor que cero."; if (order === null) errors.display_order = "Ingresá el orden.";
  const start = nullable(form, "promotion_start"); const end = nullable(form, "promotion_end"); if (start && !Number.isFinite(Date.parse(start))) errors.promotion_start = "Ingresá una fecha válida."; if (end && !Number.isFinite(Date.parse(end))) errors.promotion_end = "Ingresá una fecha válida."; if (start && end && Date.parse(end) < Date.parse(start)) errors.promotion_end = "El fin debe ser posterior al inicio.";
  if (Object.keys(errors).length || price === null || order === null) return { errors };
  const data: Omit<ConectarPlayPlan, "id"> = { name, slug, description: nullable(form, "description"), promotional_price: price, promotion_label: nullable(form, "promotion_label"), promotion_discount_percent: discount, promotion_duration_months: duration, promotion_start: start ? new Date(start).toISOString() : null, promotion_end: end ? new Date(end).toISOString() : null, includes_football: form.get("includes_football") === "on", featured: form.get("featured") === "on", active: form.get("active") === "on", display_order: order };
  return { errors, data };
}

export function parsePlayPack(form: FormData) { const errors: Record<string, string> = {}; const name = text(form, "name"); const price = optionalNumber(form, "price", errors); const order = optionalNumber(form, "display_order", errors, { integer: true }); if (!name) errors.name = "Ingresá el nombre."; if (order === null) errors.display_order = "Ingresá el orden."; if (Object.keys(errors).length || order === null) return { errors }; const data: Omit<ConectarPlayPack, "id"> = { name, description: nullable(form, "description"), price, active: form.get("active") === "on", display_order: order }; return { errors, data }; }
export function parsePlayFaq(form: FormData) { const errors: Record<string, string> = {}; const question = text(form, "question"); const answer = text(form, "answer"); const order = optionalNumber(form, "display_order", errors, { integer: true }); if (!question) errors.question = "Ingresá la pregunta."; if (!answer) errors.answer = "Ingresá la respuesta."; if (order === null) errors.display_order = "Ingresá el orden."; if (Object.keys(errors).length || order === null) return { errors }; const data: Omit<ConectarPlayFaq, "id"> = { question, answer, active: form.get("active") === "on", display_order: order }; return { errors, data }; }
