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
      <div className="public-container flex h-[72px] items-center justify-between gap-4">
        <div className="flex shrink-0 items-center gap-4">
          <Link
            className="group flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            href="/hogar"
            aria-label={`${configuration.siteName}, ir a Hogar`}
          >
            <span
              className="relative h-10 w-8 shrink-0"
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

          <SegmentSelector className="hidden min-[1180px]:inline-flex" />
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
              <svg
                aria-hidden="true"
                className="size-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.273.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.89-9.884 2.64 0 5.122 1.03 6.988 2.898a9.83 9.83 0 0 1 2.893 6.99c-.002 5.45-4.437 9.884-9.887 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
          )}
        </nav>

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
    </header>
  );
}
