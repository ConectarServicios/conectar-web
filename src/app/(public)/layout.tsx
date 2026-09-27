import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ImportantNewsBanner } from "@/components/public/important-news-banner";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { PromoTopBar } from "@/components/public/promo-top-bar";
import { getPublicContactInformation } from "@/lib/supabase/contact-information";
import { getPublicFeaturedAlert } from "@/lib/supabase/news";
import { getPublicSiteConfiguration } from "@/lib/supabase/site-settings";
import { getSiteUrl } from "@/lib/utils/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const configuration = await getPublicSiteConfiguration();
  const siteUrl = getSiteUrl();

  return {
    title: {
      absolute: configuration.seoDefaultTitle,
      template: "%s",
    },
    description: configuration.seoDefaultDescription,
    applicationName: configuration.siteName,
    creator: "Conectar Servicios",
    publisher: "Conectar Servicios",
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: configuration.siteName,
      title: configuration.seoDefaultTitle,
      description: configuration.seoDefaultDescription,
      ...(siteUrl ? { url: siteUrl } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: configuration.seoDefaultTitle,
      description: configuration.seoDefaultDescription,
    },
  };
}

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const [configuration, contact, alert] = await Promise.all([
    getPublicSiteConfiguration(),
    getPublicContactInformation(),
    getPublicFeaturedAlert(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950">
      {alert.data ? <ImportantNewsBanner item={alert.data} /> : null}
      <PromoTopBar hideOnMobile={Boolean(alert.data)} />
      <PublicHeader configuration={configuration} whatsapp={contact.data?.whatsapp ?? null} />
      <div className="flex-1">{children}</div>
      <PublicFooter configuration={configuration} />
    </div>
  );
}
