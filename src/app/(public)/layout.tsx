import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { PromoTopBar } from "@/components/public/promo-top-bar";

export const metadata: Metadata = {
  title: "Conectar Servicios",
  description: "Soluciones de conectividad para hogares y organizaciones.",
};

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950">
      <PromoTopBar />
      <PublicHeader />
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </div>
  );
}
