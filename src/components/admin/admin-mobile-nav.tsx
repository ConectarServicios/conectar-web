"use client";

import { useEffect, useRef, useState } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import type { AdminRole } from "@/types/admin";

export function AdminMobileNav({ role }: Readonly<{ role: AdminRole }>) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (!isOpen) return;

    const drawer = drawerRef.current;
    const trigger = triggerRef.current;
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
      document.body.style.overflow = "";
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
        className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        onClick={() => setIsOpen((open) => !open)}
        ref={triggerRef}
        type="button"
      >
        <span aria-hidden="true" className="text-xl leading-none">{isOpen ? "×" : "☰"}</span>
      </button>
      {isOpen ? (
        <>
          <button aria-label="Cerrar menú" className="fixed inset-0 z-40 bg-slate-950/60" onClick={() => setIsOpen(false)} type="button" />
          <aside aria-label="Navegación administrativa" aria-modal="true" id="admin-mobile-menu" ref={drawerRef} role="dialog" className="fixed inset-y-0 left-0 z-50 w-[min(20rem,88vw)] overflow-y-auto bg-slate-950 p-5 shadow-2xl">
            <div className="mb-8 flex items-start justify-between border-b border-slate-800 pb-5">
              <div>
                <p className="text-lg font-bold text-white">Conectar</p>
                <p className="text-xs font-medium tracking-[0.16em] text-orange-400 uppercase">Servicios · Admin</p>
              </div>
              <button aria-label="Cerrar menú" className="rounded-md px-2 text-2xl text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-orange-400" onClick={() => setIsOpen(false)} type="button">×</button>
            </div>
            <AdminNav onNavigate={() => setIsOpen(false)} role={role} />
          </aside>
        </>
      ) : null}
    </div>
  );
}
