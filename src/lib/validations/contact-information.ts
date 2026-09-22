import type { ContactInformation } from "@/types/contact-information";

type ContactField = Exclude<keyof ContactInformation, "id">;

const MAX_TEXT_LENGTH = 500;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function valueOf(formData: FormData, field: ContactField) {
  return String(formData.get(field) ?? "").trim();
}

export function isAllowedContactNumber(value: string | null) {
  if (!value) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export function parseContactInformation(formData: FormData) {
  const values = {
    phone: valueOf(formData, "phone"),
    whatsapp: valueOf(formData, "whatsapp"),
    commercial_email: valueOf(formData, "commercial_email"),
    address: valueOf(formData, "address"),
    business_hours: valueOf(formData, "business_hours"),
    guard_hours: valueOf(formData, "guard_hours"),
  };
  const fieldErrors: Partial<Record<ContactField, string>> = {};

  if (values.phone && !isAllowedContactNumber(values.phone)) fieldErrors.phone = "Ingresá un número de teléfono válido.";
  if (!values.whatsapp) fieldErrors.whatsapp = "Ingresá el WhatsApp institucional.";
  else if (!isAllowedContactNumber(values.whatsapp)) fieldErrors.whatsapp = "Ingresá un número de WhatsApp válido.";
  if (!values.commercial_email) fieldErrors.commercial_email = "Ingresá el email comercial.";
  else if (!EMAIL_PATTERN.test(values.commercial_email)) fieldErrors.commercial_email = "Ingresá un email comercial válido.";
  if (!values.address) fieldErrors.address = "Ingresá la dirección.";
  if (!values.business_hours) fieldErrors.business_hours = "Ingresá los horarios de atención.";
  if (!values.guard_hours) fieldErrors.guard_hours = "Ingresá los horarios de guardia.";

  for (const [field, value] of Object.entries(values) as [ContactField, string][]) {
    if (value.length > MAX_TEXT_LENGTH) fieldErrors[field] = `El campo no puede superar los ${MAX_TEXT_LENGTH} caracteres.`;
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };
  return { values: { ...values, phone: values.phone || null } };
}
