import type { PublicResult } from "./public-result.ts";

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function strings(row: Record<string, unknown>, fields: string[]) {
  return fields.every(field => typeof row[field] === "string");
}
function nullableStrings(row: Record<string, unknown>, fields: string[]) {
  return fields.every(field => row[field] === null || typeof row[field] === "string");
}
function date(value: unknown) {
  return value === null || typeof value === "string" && Number.isFinite(Date.parse(value));
}
export function successful(value: unknown): value is PublicResult<unknown> {
  return record(value) && value.unavailable === false && "data" in value;
}
export function validNews(row: unknown) {
  return record(row) && strings(row, ["id", "title", "slug", "content", "created_at"])
    && nullableStrings(row, ["excerpt", "cover_image", "category", "author_id", "content_module"])
    && row.status === "published" && typeof row.featured === "boolean"
    && typeof row.published_at === "string" && date(row.published_at) && date(row.alert_ends_at);
}
export function validEvent(row: unknown) {
  return record(row) && strings(row, ["id", "title", "slug", "summary", "description", "created_at"])
    && nullableStrings(row, ["image_path", "location", "address", "button_text", "button_url"])
    && row.status === "published" && typeof row.featured === "boolean" && date(row.starts_at) && date(row.ends_at);
}
export function validFaq(row: unknown) {
  return record(row) && strings(row, ["id", "question", "answer"]) && row.active === true && typeof row.display_order === "number";
}
export function validGeneralFaq(row: unknown) {
  return record(row) && validFaq(row) && strings(row, ["category", "created_at", "updated_at"]) && typeof row.featured === "boolean";
}
export function validContact(row: unknown) {
  return record(row) && strings(row, ["id"]) && nullableStrings(row, ["phone", "whatsapp", "commercial_email", "address", "business_hours", "guard_hours"]);
}
export function validSocial(row: unknown) {
  return record(row) && strings(row, ["id", "platform", "url"]) && row.active === true && typeof row.display_order === "number";
}
export function validList<T>(value: PublicResult<T[]>, item: (row: unknown) => boolean) {
  return successful(value) && Array.isArray(value.data) && value.data.every(item);
}
export function validDetail<T>(value: PublicResult<T | null>, item: (row: unknown) => boolean) {
  return successful(value) && (value.data === null || item(value.data));
}
