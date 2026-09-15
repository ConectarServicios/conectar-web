"use client";

import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PublicMobileNav } from "@/components/public/public-mobile-nav";
import { usePublicSegment } from "@/components/public/public-segment-context";
import { SegmentSelector } from "@/components/public/segment-selector";
import { isAllowedContactNumber } from "@/lib/validations/contact-information";
import type { SiteConfiguration } from "@/types/site-settings";

const navigation = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#contacto", label: "Contacto" },
];

type PublicHeaderProps = Readonly<{
  configuration: Pick<SiteConfiguration, "siteName" | "selfServiceUrl">;
  whatsapp: string | null;
}>;

export function PublicHeader({ configuration, whatsapp }: PublicHeaderProps) {
  const { segment } = usePublicSegment();
  const whatsappDigits = whatsapp && isAllowedContactNumber(whatsapp)
    ? whatsapp.replace(/\D/g, "")
    : "";
  const whatsappAccentClass = segment === "hogar"
    ? "bg-[#12b886] text-[#03221b] hover:bg-[#18c996] focus-visible:outline-[#55e0b8]"
    : "bg-[#2f6bff] text-white hover:bg-[#477dff] focus-visible:outline-[#7da1ff]";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071a2f]/95 text-white shadow-lg shadow-slate-950/20 backdrop-blur-xl">
      <div className="public-container flex h-[72px] items-center justify-between gap-4">
        <Link
          className="group flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          href="/#inicio"
          aria-label={`${configuration.siteName}, ir al inicio`}
        >
          <span className="relative h-10 w-8 shrink-0" aria-hidden="true">
            <Image alt="" className="object-contain" fill sizes="32px" src="/brand/conectar-isotipo.png" priority />
          </span>
          <span className="font-display text-[15px] font-bold tracking-[-0.02em] sm:text-base">
            {configuration.siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          <SegmentSelector className="mr-3" />
          {navigation.map((item) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <a
            className="ml-2 inline-flex min-h-10 items-center justify-center rounded-lg border border-white/20 bg-white/[0.04] px-4 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            href={configuration.selfServiceUrl}
          >
            Autogestión
          </a>
          {whatsappDigits && (
            <a
              className={`ml-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${whatsappAccentClass}`}
              href={`https://wa.me/${whatsappDigits}`}
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Contactar por WhatsApp (abre en una pestaña nueva)"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              WhatsApp
            </a>
          )}
        </nav>
        <PublicMobileNav
          items={navigation}
          selfServiceUrl={configuration.selfServiceUrl}
          whatsappUrl={whatsappDigits ? `https://wa.me/${whatsappDigits}` : null}
        />
      </div>
    </header>
  );
}
