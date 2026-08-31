export type SiteConfiguration = {
  internetInstallationPrice: number;
  internetInstallationBenefitsText: string;
  siteName: string;
  footerTagline: string;
  selfServiceUrl: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
};

export type SettingsActionState = {
  message?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
};
