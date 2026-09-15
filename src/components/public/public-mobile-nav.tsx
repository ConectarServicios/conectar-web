"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePublicSegment } from "@/components/public/public-segment-context";
import { SegmentSelector } from "@/components/public/segment-selector";

type NavigationItem = {
  href: string;
  label: string;
};

type PublicMobileNavProps = Readonly<{
  items: NavigationItem[];
  selfServiceUrl: string;
  whatsappUrl: string | null;
}>;

export function PublicMobileNav({ items, selfServiceUrl, whatsappUrl }: PublicMobileNavProps) {
  const [open, setOpen] = useState(false);
  const { segment } = usePublicSegment();
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
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menu?.contains(target) || trigger?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        className="grid size-11 place-items-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
          className="absolute inset-x-4 top-[4.75rem] rounded-2xl border border-white/10 bg-[#0b2440] p-3 shadow-2xl shadow-black/30"
          id="mobile-navigation"
          aria-label="Navegación mobile"
          ref={menuRef}
        >
          <div className="mb-2 border-b border-white/10 px-2 pb-3">
            <p className="mb-2 text-xs font-bold tracking-[0.12em] text-slate-400 uppercase">Segmento</p>
            <SegmentSelector />
          </div>
          {items.map((item) => (
            <Link
              className="block rounded-xl px-4 py-3 font-semibold text-slate-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {whatsappUrl && (
            <a
              className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href={whatsappUrl}
              onClick={() => setOpen(false)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" className="size-5" />
              WhatsApp
            </a>
          )}
          <a
            className={`mt-2 flex min-h-12 items-center justify-center rounded-xl px-4 py-3 font-extrabold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${segment === "hogar" ? "bg-[#12b886] text-[#03221b] hover:bg-[#18c996]" : "bg-[#2f6bff] text-white hover:bg-[#477dff]"}`}
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
