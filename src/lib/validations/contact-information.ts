const MAX_HOURS_LENGTH = 500;

function parseHours(formData: FormData, field: string, label: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) return { error: `Ingresá los ${label.toLowerCase()}.` };
  if (value.length > MAX_HOURS_LENGTH) {
    return { error: `${label} no puede superar los ${MAX_HOURS_LENGTH} caracteres.` };
  }
  return { value };
}

export function parseContactHours(formData: FormData) {
  const businessHours = parseHours(formData, "business_hours", "Horarios de atención");
  const guardHours = parseHours(formData, "guard_hours", "Horarios de guardia");

  const fieldErrors = {
    ...(businessHours.error ? { business_hours: businessHours.error } : {}),
    ...(guardHours.error ? { guard_hours: guardHours.error } : {}),
  };

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };
  return { businessHours: businessHours.value!, guardHours: guardHours.value! };
}
