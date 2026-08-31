import { cache } from "react";
import { unstable_rethrow } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { SiteConfiguration } from "@/types/site-settings";

export const SITE_SETTING_KEYS = {
  internetInstallationPrice: "internet_installation_price",
  internetInstallationBenefitsText: "internet_installation_benefits_text",
  siteName: "site_name",
  footerTagline: "footer_tagline",
  selfServiceUrl: "self_service_url",
  seoDefaultTitle: "seo_default_title",
  seoDefaultDescription: "seo_default_description",
} as const;

export const SITE_CONFIGURATION_DEFAULTS: SiteConfiguration = {
  internetInstallationPrice: 24300,
  internetInstallationBenefitsText:
    "Consultá por descuentos y bonificaciones disponibles según beneficios y convenios vigentes.",
  siteName: "Conectar Servicios",
  footerTagline: "Soluciones de conectividad.",
  selfServiceUrl: "https://autogestion.conectarservicios.com.ar/",
  seoDefaultTitle: "Conectar Servicios",
  seoDefaultDescription:
    "Soluciones de conectividad para hogares y organizaciones.",
};

export const SITE_SETTING_DESCRIPTIONS: Record<keyof SiteConfiguration, string> = {
  internetInstallationPrice: "Precio vigente de instalación del servicio de Internet",
  internetInstallationBenefitsText:
    "Texto público sobre beneficios y bonificaciones de instalación de Internet",
  siteName: "Nombre público del sitio y de la organización",
  footerTagline: "Texto institucional breve mostrado en el pie del sitio",
  selfServiceUrl: "URL pública de acceso al portal de Autogestión",
  seoDefaultTitle: "Título SEO predeterminado del sitio público",
  seoDefaultDescription: "Descripción SEO predeterminada del sitio público",
};

type SettingRow = { key: string; value: unknown };

function applyRows(rows: SettingRow[]): SiteConfiguration {
  const values = new Map(rows.map((row) => [row.key, row.value]));
  const numberValue = values.get(SITE_SETTING_KEYS.internetInstallationPrice);
  const textValue = (field: keyof SiteConfiguration) => {
    const value = values.get(SITE_SETTING_KEYS[field]);
    return typeof value === "string" && value.trim()
      ? value
      : SITE_CONFIGURATION_DEFAULTS[field];
  };

  return {
    internetInstallationPrice:
      typeof numberValue === "number" && Number.isFinite(numberValue) && numberValue >= 0
        ? numberValue
        : SITE_CONFIGURATION_DEFAULTS.internetInstallationPrice,
    internetInstallationBenefitsText: textValue("internetInstallationBenefitsText") as string,
    siteName: textValue("siteName") as string,
    footerTagline: textValue("footerTagline") as string,
    selfServiceUrl: textValue("selfServiceUrl") as string,
    seoDefaultTitle: textValue("seoDefaultTitle") as string,
    seoDefaultDescription: textValue("seoDefaultDescription") as string,
  };
}

export const getPublicSiteConfiguration = cache(async (): Promise<SiteConfiguration> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", Object.values(SITE_SETTING_KEYS))
      .eq("is_public", true);

    if (error) {
      console.error("Unable to load public site configuration", error);
      return SITE_CONFIGURATION_DEFAULTS;
    }

    return applyRows(data ?? []);
  } catch (error) {
    unstable_rethrow(error);
    console.error("Unable to initialize public site configuration query", error);
    return SITE_CONFIGURATION_DEFAULTS;
  }
});
