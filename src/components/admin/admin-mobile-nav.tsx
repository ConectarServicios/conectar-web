"use client";

import { useEffect, useState } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import type { AdminRole } from "@/types/admin";

export function AdminMobileNav({ role }: Readonly<{ role: AdminRole }>) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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
        type="button"
      >
        <span aria-hidden="true" className="text-xl leading-none">{isOpen ? "×" : "☰"}</span>
      </button>
      {isOpen ? (
        <>
          <button aria-label="Cerrar menú" className="fixed inset-0 z-40 bg-slate-950/60" onClick={() => setIsOpen(false)} type="button" />
          <aside id="admin-mobile-menu" className="fixed inset-y-0 left-0 z-50 w-[min(20rem,88vw)] overflow-y-auto bg-slate-950 p-5 shadow-2xl">
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
