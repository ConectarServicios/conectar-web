"use client";

import {
  saveIdentitySettings,
  saveInternetSettings,
  saveSeoSettings,
} from "@/app/admin/settings/actions";
import {
  FieldError,
  SettingsForm,
  settingsFieldClassName,
} from "@/components/admin/settings/settings-form";
import type { SiteConfiguration } from "@/types/site-settings";

type ConfigurationProps = Readonly<{ configuration: SiteConfiguration }>;
const labelClassName = "block text-sm font-semibold text-slate-700";
const helpClassName = "mt-1 block text-xs font-normal text-slate-500";

export function InternetSettingsForm({ configuration }: ConfigurationProps) {
  return (
    <SettingsForm action={saveInternetSettings}>
      {(errors) => (
        <>
          <label className={labelClassName} htmlFor="internet_installation_price">
            Precio de instalación *
            <input
              className={settingsFieldClassName}
              defaultValue={configuration.internetInstallationPrice}
              id="internet_installation_price"
              min="0"
              name="internet_installation_price"
              required
              step="0.01"
              type="number"
            />
            <span className={helpClassName}>Importe en pesos argentinos, sin símbolo de moneda.</span>
            <FieldError>{errors.internet_installation_price}</FieldError>
          </label>
          <label className={labelClassName} htmlFor="internet_installation_benefits_text">
            Texto de beneficios de instalación *
            <textarea
              className={`${settingsFieldClassName} min-h-28 resize-y`}
              defaultValue={configuration.internetInstallationBenefitsText}
              id="internet_installation_benefits_text"
              name="internet_installation_benefits_text"
              required
            />
            <FieldError>{errors.internet_installation_benefits_text}</FieldError>
          </label>
        </>
      )}
    </SettingsForm>
  );
}

export function IdentitySettingsForm({ configuration }: ConfigurationProps) {
  return (
    <SettingsForm action={saveIdentitySettings}>
      {(errors) => (
        <>
          <label className={labelClassName} htmlFor="site_name">
            Nombre del sitio *
            <input className={settingsFieldClassName} defaultValue={configuration.siteName} id="site_name" maxLength={80} name="site_name" required />
            <FieldError>{errors.site_name}</FieldError>
          </label>
          <label className={labelClassName} htmlFor="footer_tagline">
            Texto breve del footer *
            <textarea className={`${settingsFieldClassName} min-h-24 resize-y`} defaultValue={configuration.footerTagline} id="footer_tagline" maxLength={200} name="footer_tagline" required />
            <FieldError>{errors.footer_tagline}</FieldError>
          </label>
          <label className={labelClassName} htmlFor="self_service_url">
            URL de Autogestión *
            <input className={settingsFieldClassName} defaultValue={configuration.selfServiceUrl} id="self_service_url" maxLength={2048} name="self_service_url" placeholder="https://" required type="url" />
            <span className={helpClassName}>Se recomienda utilizar una URL segura que comience con https://.</span>
            <FieldError>{errors.self_service_url}</FieldError>
          </label>
        </>
      )}
    </SettingsForm>
  );
}

export function SeoSettingsForm({ configuration }: ConfigurationProps) {
  return (
    <SettingsForm action={saveSeoSettings}>
      {(errors) => (
        <>
          <label className={labelClassName} htmlFor="seo_default_title">
            Título predeterminado *
            <input className={settingsFieldClassName} defaultValue={configuration.seoDefaultTitle} id="seo_default_title" maxLength={100} name="seo_default_title" required />
            <span className={helpClassName}>Se utiliza como título general cuando una página no define uno específico.</span>
            <FieldError>{errors.seo_default_title}</FieldError>
          </label>
          <label className={labelClassName} htmlFor="seo_default_description">
            Descripción general *
            <textarea className={`${settingsFieldClassName} min-h-28 resize-y`} defaultValue={configuration.seoDefaultDescription} id="seo_default_description" maxLength={320} name="seo_default_description" required />
            <span className={helpClassName}>Se utiliza como descripción general para buscadores y vistas previas.</span>
            <FieldError>{errors.seo_default_description}</FieldError>
          </label>
        </>
      )}
    </SettingsForm>
  );
}
