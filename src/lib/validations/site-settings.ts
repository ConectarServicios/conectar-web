import type { SiteConfiguration } from "@/types/site-settings";
import { isSafeExternalHttpUrl } from "@/lib/validations/public-urls";

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
): ParsedSettings<Pick<SiteConfiguration, "internetInstallationPrice" | "internetInstallationBenefitsText" | "internetInstallationInstallmentCount" | "internetInstallationInstallmentPrice">> {
  const fieldErrors: Record<string, string> = {};
  const rawPrice = text(formData, "internet_installation_price");
  const internetInstallationPrice = Number(rawPrice);
  const rawInstallmentCount = text(formData, "internet_installation_installment_count");
  const rawInstallmentPrice = text(formData, "internet_installation_installment_price");
  const internetInstallationInstallmentCount = rawInstallmentCount
    ? Number(rawInstallmentCount)
    : null;
  const internetInstallationInstallmentPrice = rawInstallmentPrice
    ? Number(rawInstallmentPrice)
    : null;
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
  if (
    internetInstallationInstallmentCount !== null &&
    (!Number.isInteger(internetInstallationInstallmentCount) || internetInstallationInstallmentCount <= 0)
  ) {
    fieldErrors.internet_installation_installment_count = "Ingresá un entero mayor que cero.";
  }
  if (
    internetInstallationInstallmentPrice !== null &&
    (!Number.isFinite(internetInstallationInstallmentPrice) || internetInstallationInstallmentPrice < 0)
  ) {
    fieldErrors.internet_installation_installment_price = "Ingresá un precio mayor o igual a 0.";
  }
  if (Boolean(rawInstallmentCount) !== Boolean(rawInstallmentPrice)) {
    const message = "Completá la cantidad de cuotas y el valor de cada cuota.";
    fieldErrors.internet_installation_installment_count ??= message;
    fieldErrors.internet_installation_installment_price ??= message;
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  return {
    fieldErrors,
    values: {
      internetInstallationPrice,
      internetInstallationBenefitsText,
      internetInstallationInstallmentCount,
      internetInstallationInstallmentPrice,
    },
  };
}

export function parseIdentitySettings(
  formData: FormData,
): ParsedSettings<Pick<SiteConfiguration, "siteName" | "footerTagline" | "selfServiceUrl">> {
  const fieldErrors: Record<string, string> = {};
  const siteName = requiredText(formData, "site_name", "el nombre del sitio", 80, fieldErrors);
  const footerTagline = requiredText(formData, "footer_tagline", "el texto del footer", 200, fieldErrors);
  const selfServiceUrl = String(formData.get("self_service_url") ?? "");
  if (!selfServiceUrl) fieldErrors.self_service_url = "Ingresá la URL de Autogestión.";
  else if (selfServiceUrl.length > 2048) fieldErrors.self_service_url = "No puede superar los 2048 caracteres.";

  if (selfServiceUrl && !isSafeExternalHttpUrl(selfServiceUrl)) fieldErrors.self_service_url = "Ingresá una URL absoluta que comience con http:// o https://.";
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
