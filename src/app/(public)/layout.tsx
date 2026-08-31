import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { PromoTopBar } from "@/components/public/promo-top-bar";
import { getPublicSiteConfiguration } from "@/lib/supabase/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const configuration = await getPublicSiteConfiguration();
  return {
    title: {
      absolute: configuration.seoDefaultTitle,
      template: "%s",
    },
    description: configuration.seoDefaultDescription,
  };
}

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const configuration = await getPublicSiteConfiguration();

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950">
      <PromoTopBar />
      <PublicHeader configuration={configuration} />
      <div className="flex-1">{children}</div>
      <PublicFooter configuration={configuration} />
    </div>
  );
}
