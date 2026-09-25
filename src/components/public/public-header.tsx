"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DesktopNewsMenu } from "@/components/public/desktop-news-menu";
import { PublicMobileNav } from "@/components/public/public-mobile-nav";
import {
  getContactHref,
  isNavigationItemActive,
  publicNavigation,
} from "@/components/public/public-navigation";
import { SegmentSelector } from "@/components/public/segment-selector";
import { WhatsAppIcon } from "@/components/public/whatsapp-icon";
import { isAllowedContactNumber } from "@/lib/validations/contact-information";
import type { SiteConfiguration } from "@/types/site-settings";

type PublicHeaderProps = Readonly<{
  configuration: Pick<SiteConfiguration, "siteName" | "selfServiceUrl">;
  whatsapp: string | null;
}>;

export function PublicHeader({
  configuration,
  whatsapp,
}: PublicHeaderProps) {
  const pathname = usePathname();

  const contactHref = getContactHref(pathname);

  const whatsappDigits =
    whatsapp && isAllowedContactNumber(whatsapp)
      ? whatsapp.replace(/\D/g, "")
      : "";

  const whatsappAccentClass =
    "bg-whatsapp text-brand-navy-deep hover:bg-whatsapp-strong hover:text-white focus-visible:outline-whatsapp";

  const linkClass =
    "rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-white";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-navy-deep/95 text-white shadow-lg shadow-slate-950/20 backdrop-blur-xl">
      <div className="public-container flex h-16 items-center justify-between gap-2 sm:h-[72px] sm:gap-4">
        <div className="flex shrink-0 items-center gap-4">
          <Link
            className="group flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            href="/hogar"
            aria-label={`${configuration.siteName}, ir a Hogar`}
          >
            <span
              className="relative h-11 w-9 shrink-0 sm:h-10 sm:w-8"
              aria-hidden="true"
            >
              <Image
                alt=""
                className="object-contain"
                fill
                sizes="32px"
                src="/brand/conectar-isotipo.png"
                priority
              />
            </span>

            <span className="font-display hidden text-[15px] font-bold tracking-[-0.02em] sm:inline sm:text-base">
              {configuration.siteName}
            </span>
          </Link>

          <div className="hidden min-[1180px]:block">
            <SegmentSelector />
          </div>
        </div>

        <nav
          className="hidden items-center gap-0.5 min-[1180px]:flex"
          aria-label="Navegación principal"
        >
          {publicNavigation.map((item) => {
            const active = isNavigationItemActive(pathname, item);

            if (item.children) {
              return (
                <DesktopNewsMenu
                  item={item}
                  key={`${item.label}-${pathname}`}
                  linkClass={linkClass}
                />
              );
            }

            return (
              <Link
                className={`${linkClass} ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-300"
                }`}
                href={item.href}
                key={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            className={`${linkClass} text-slate-300`}
            href={contactHref}
          >
            Contacto
          </Link>

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
              <WhatsAppIcon />
              WhatsApp
            </a>
          )}
        </nav>

        <div className="flex items-center gap-2 min-[1180px]:hidden">
          <div className="sm:hidden">
            <SegmentSelector />
          </div>
          <PublicMobileNav
            key={pathname}
            selfServiceUrl={configuration.selfServiceUrl}
            whatsappUrl={
              whatsappDigits
                ? `https://wa.me/${whatsappDigits}`
                : null
            }
          />
        </div>
      </div>
    </header>
  );
}
