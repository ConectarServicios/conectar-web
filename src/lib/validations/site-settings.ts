export function parseInstallationPrice(formData: FormData) {
  const rawValue = String(formData.get("installation_price") ?? "").trim();
  if (!rawValue) return { error: "Ingresá el precio de instalación." };

  const value = Number(rawValue);
  if (!Number.isFinite(value) || value < 0) {
    return { error: "Ingresá un precio mayor o igual a cero." };
  }

  return { value };
}

export function parseInstallationBenefitsText(formData: FormData) {
  const value = String(formData.get("installation_benefits_text") ?? "").trim();
  if (!value) return { error: "Ingresá el texto de beneficios de instalación." };

  return { value };
}
