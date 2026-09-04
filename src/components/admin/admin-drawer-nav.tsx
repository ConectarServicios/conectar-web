"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AdminNav } from "@/components/admin/admin-nav";
import type { AdminRole } from "@/types/admin";

const MENU_ID = "admin-drawer-menu";

export function AdminDrawerNav({ role }: Readonly<{ role: AdminRole }>) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div>
      <button
        aria-controls={MENU_ID}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span aria-hidden="true" className="text-xl leading-none">{isOpen ? "×" : "☰"}</span>
      </button>
      {isOpen && typeof document !== "undefined" ? createPortal(
        <>
          <button aria-label="Cerrar menú" className="fixed inset-0 z-50 bg-slate-950/60" onClick={() => setIsOpen(false)} type="button" />
          <aside id={MENU_ID} className="fixed inset-y-0 left-0 z-[60] w-[min(20rem,88vw)] overflow-y-auto bg-slate-950 p-5 shadow-2xl">
            <div className="mb-8 flex items-start justify-between border-b border-slate-800 pb-5">
              <div>
                <p className="text-lg font-bold text-white">Conectar</p>
                <p className="text-xs font-medium tracking-[0.16em] text-orange-400 uppercase">Servicios · Admin</p>
              </div>
              <button aria-label="Cerrar menú" className="rounded-md px-2 text-2xl text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-orange-400" onClick={() => setIsOpen(false)} type="button">×</button>
            </div>
            <AdminNav onNavigate={() => setIsOpen(false)} role={role} />
          </aside>
        </>,
        document.body,
      ) : null}
    </div>
  );
}
