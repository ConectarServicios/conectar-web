import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { PromoTopBar } from "@/components/public/promo-top-bar";
import { getPublicContactInformation } from "@/lib/supabase/contact-information";
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

// Content must be checked on each request; outage fallbacks are not a snapshot.
export const dynamic = "force-dynamic";

async function PublicNavigation() {
  const [configuration, contact] = await Promise.all([
    getPublicSiteConfiguration(),
    getPublicContactInformation(),
  ]);
  return <PublicHeader configuration={configuration} whatsapp={contact.data?.whatsapp ?? null} />;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950">
        <Suspense fallback={null}><PromoTopBar /></Suspense>
        <Suspense fallback={<nav aria-label="Cargando navegación" className="min-h-20 bg-brand-navy-deep" />}><PublicNavigation /></Suspense>
        <div className="flex-1">{children}</div>
        <Suspense fallback={null}><PublicFooter configuration={getPublicSiteConfiguration()} /></Suspense>
    </div>
  );
}
