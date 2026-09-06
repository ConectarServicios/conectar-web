"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type NavigationItem = {
  href: string;
  label: string;
};

type PublicMobileNavProps = Readonly<{
  items: NavigationItem[];
  selfServiceUrl: string;
}>;

export function PublicMobileNav({ items, selfServiceUrl }: PublicMobileNavProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    const trigger = triggerRef.current;
    menu?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menu) return;

      const focusable = Array.from(
        menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        className="grid size-11 place-items-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded={open}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((current) => !current)}
        ref={triggerRef}
      >
        <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
        <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
          <span className={`h-0.5 w-full bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-full bg-current transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-full bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </span>
      </button>
      {open && (
        <nav
          className="absolute inset-x-4 top-[4.75rem] rounded-2xl border border-slate-700 bg-[#0b2440] p-3 shadow-2xl"
          id="mobile-navigation"
          aria-label="Navegación mobile"
          aria-modal="true"
          ref={menuRef}
          role="dialog"
        >
          {items.map((item) => (
            <Link
              className="block rounded-xl px-4 py-3 font-semibold text-slate-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-orange-400"
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            className="mt-2 flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-4 py-3 font-bold text-white shadow-md shadow-orange-950/30 transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            href={selfServiceUrl}
            onClick={() => setOpen(false)}
          >
            Autogestión
          </a>
        </nav>
      )}
    </div>
  );
}
