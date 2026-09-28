"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

import { AdminNav } from "@/components/admin/admin-nav";
import type { AdminRole } from "@/types/admin";

export function AdminMobileNav({ role }: Readonly<{ role: AdminRole }>) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const drawer = drawerRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer?.querySelector<HTMLElement>("button, a[href]")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawer) return;

      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("hidden"));
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
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        aria-controls="admin-mobile-menu"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        className="grid size-11 shrink-0 touch-manipulation place-items-center rounded-xl border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        onClick={() => setIsOpen((open) => !open)}
        ref={triggerRef}
        type="button"
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>
      {isOpen ? (
        <>
          <button aria-label="Cerrar menú" className="fixed inset-0 z-40 touch-none bg-slate-950/65 backdrop-blur-[1px]" onClick={() => setIsOpen(false)} type="button" />
          <aside aria-label="Navegación administrativa" aria-modal="true" id="admin-mobile-menu" ref={drawerRef} role="dialog" className="fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(20rem,88vw)] flex-col overflow-hidden bg-slate-950 shadow-2xl [padding-top:env(safe-area-inset-top)] [padding-bottom:env(safe-area-inset-bottom)]">
            <div className="flex shrink-0 items-start justify-between border-b border-slate-800 p-5">
              <div>
                <p className="text-lg font-bold text-white">Conectar</p>
                <p className="text-xs font-medium tracking-[0.16em] text-orange-400 uppercase">Servicios · Admin</p>
              </div>
              <button aria-label="Cerrar menú" className="grid size-11 touch-manipulation place-items-center rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-orange-400" onClick={() => setIsOpen(false)} type="button"><X aria-hidden="true" className="size-6" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 [-webkit-overflow-scrolling:touch]"><AdminNav onNavigate={() => setIsOpen(false)} role={role} /></div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
