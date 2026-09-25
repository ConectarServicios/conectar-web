"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  getContactHref,
  isNavigationItemActive,
  publicNavigation,
} from "@/components/public/public-navigation";
import { WhatsAppIcon } from "@/components/public/whatsapp-icon";

type PublicMobileNavProps = Readonly<{
  selfServiceUrl: string;
  whatsappUrl: string | null;
}>;

export function PublicMobileNav({
  selfServiceUrl,
  whatsappUrl,
}: PublicMobileNavProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    const trigger = triggerRef.current;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    menu
      ?.querySelector<HTMLElement>(
        "a[href], button:not([disabled])",
      )
      ?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === "Tab" && menu) {
        const focusable = Array.from(
          menu.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );

        const first = focusable[0];
        const last = focusable.at(-1);

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        !(target instanceof Node) ||
        menu?.contains(target) ||
        trigger?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );

      trigger?.focus();
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <div className="min-[1180px]:hidden">
      <button
        className="grid size-10 place-items-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-11"
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded={open}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((current) => !current)}
        ref={triggerRef}
      >
        <span className="sr-only">
          {open ? "Cerrar menú" : "Abrir menú"}
        </span>

        <span
          className="flex w-5 flex-col gap-1.5"
          aria-hidden="true"
        >
          <span
            className={`h-0.5 w-full bg-current transition ${
              open
                ? "translate-y-2 rotate-45"
                : ""
            }`}
          />

          <span
            className={`h-0.5 w-full bg-current transition ${
              open ? "opacity-0" : ""
            }`}
          />

          <span
            className={`h-0.5 w-full bg-current transition ${
              open
                ? "-translate-y-2 -rotate-45"
                : ""
            }`}
          />
        </span>
      </button>

      {open && (
        <nav
          className="absolute inset-x-4 top-[4.25rem] max-h-[calc(100vh-5rem)] max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-2xl border border-white/10 bg-brand-navy p-3 shadow-2xl shadow-black/30 sm:top-[4.75rem] sm:max-h-[calc(100vh-6rem)] sm:max-h-[calc(100dvh-6rem)]"
          id="mobile-navigation"
          aria-label="Navegación mobile"
          ref={menuRef}
        >
          {publicNavigation.map((item) => {
            const active = isNavigationItemActive(
              pathname,
              item,
            );

            if (item.children) {
              return (
                <div
                  className="py-2"
                  key={item.label}
                >
                  {item.children.map((child) => (
                    <Link
                      className="block rounded-xl px-4 py-3 font-semibold text-slate-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                      href={child.href}
                      key={child.href}
                      onClick={closeMenu}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              );
            }

            return (
              <Link
                aria-current={
                  active ? "page" : undefined
                }
                className={`block rounded-xl px-4 py-3 font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-100"
                }`}
                href={item.href}
                key={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            className="block rounded-xl px-4 py-3 font-semibold text-slate-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            href={getContactHref(pathname)}
            onClick={closeMenu}
          >
            Contacto
          </Link>

          <a
            className="block rounded-xl px-4 py-3 font-semibold text-slate-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            href={selfServiceUrl}
            onClick={closeMenu}
          >
            Autogestión
          </a>

          {whatsappUrl && (
            <a
              className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 font-extrabold text-brand-navy-deep transition-colors hover:bg-whatsapp-strong hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href={whatsappUrl}
              onClick={closeMenu}
              rel="noopener noreferrer"
              target="_blank"
            >
              <WhatsAppIcon className="size-5 shrink-0" />
              WhatsApp
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
