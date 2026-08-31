import type { SiteConfiguration } from "@/types/site-settings";

type ParsedSettings<T> = { values?: T; fieldErrors: Record<string, string> };

const text = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

function requiredText(
  formData: FormData,
  key: string,
  label: string,
  maximum: number,
  fieldErrors: Record<string, string>,
) {
  const value = text(formData, key);
  if (!value) fieldErrors[key] = `Ingresá ${label}.`;
  else if (value.length > maximum) {
    fieldErrors[key] = `No puede superar los ${maximum} caracteres.`;
  }
  return value;
}

export function parseInternetSettings(
  formData: FormData,
): ParsedSettings<Pick<SiteConfiguration, "internetInstallationPrice" | "internetInstallationBenefitsText">> {
  const fieldErrors: Record<string, string> = {};
  const rawPrice = text(formData, "internet_installation_price");
  const internetInstallationPrice = Number(rawPrice);
  const internetInstallationBenefitsText = requiredText(
    formData,
    "internet_installation_benefits_text",
    "el texto de beneficios",
    1000,
    fieldErrors,
  );

  if (!rawPrice || !Number.isFinite(internetInstallationPrice) || internetInstallationPrice < 0) {
    fieldErrors.internet_installation_price = "Ingresá un precio mayor o igual a 0.";
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  return { fieldErrors, values: { internetInstallationPrice, internetInstallationBenefitsText } };
}

export function parseIdentitySettings(
  formData: FormData,
): ParsedSettings<Pick<SiteConfiguration, "siteName" | "footerTagline" | "selfServiceUrl">> {
  const fieldErrors: Record<string, string> = {};
  const siteName = requiredText(formData, "site_name", "el nombre del sitio", 80, fieldErrors);
  const footerTagline = requiredText(formData, "footer_tagline", "el texto del footer", 200, fieldErrors);
  const selfServiceUrl = requiredText(formData, "self_service_url", "la URL de Autogestión", 2048, fieldErrors);

  if (selfServiceUrl) {
    try {
      const url = new URL(selfServiceUrl);
      if (!(["http:", "https:"] as string[]).includes(url.protocol) || !url.hostname) {
        fieldErrors.self_service_url = "Ingresá una URL absoluta que comience con http:// o https://.";
      }
    } catch {
      fieldErrors.self_service_url = "Ingresá una URL absoluta válida.";
    }
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  return { fieldErrors, values: { siteName, footerTagline, selfServiceUrl } };
}

export function parseSeoSettings(
  formData: FormData,
): ParsedSettings<Pick<SiteConfiguration, "seoDefaultTitle" | "seoDefaultDescription">> {
  const fieldErrors: Record<string, string> = {};
  const seoDefaultTitle = requiredText(formData, "seo_default_title", "el título", 100, fieldErrors);
  const seoDefaultDescription = requiredText(formData, "seo_default_description", "la descripción", 320, fieldErrors);
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  return { fieldErrors, values: { seoDefaultTitle, seoDefaultDescription } };
}
