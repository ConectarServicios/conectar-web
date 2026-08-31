"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  deleteFaq,
  toggleFaqActive,
  toggleFaqFeatured,
} from "@/app/admin/faqs/actions";

export function FaqActionsMenu({
  active,
  featured,
  id,
  question,
}: Readonly<{
  active: boolean;
  featured: boolean;
  id: string;
  question: string;
}>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  useEffect(() => {
    if (!open) return;
    const outside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-orange-500"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Acciones <span aria-hidden>▾</span>
      </button>
      {open && (
        <div
          aria-label={`Acciones para ${question}`}
          className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
          id={menuId}
          role="menu"
        >
          <MenuForm
            action={toggleFaqActive}
            label={active ? "Desactivar" : "Activar"}
            onSubmit={() => setOpen(false)}
          >
            <input name="id" type="hidden" value={id} />
            <input name="active" type="hidden" value={String(!active)} />
          </MenuForm>
          <MenuForm
            action={toggleFaqFeatured}
            label={featured ? "Quitar destacado" : "Destacar"}
            onSubmit={() => setOpen(false)}
          >
            <input name="id" type="hidden" value={id} />
            <input name="featured" type="hidden" value={String(!featured)} />
          </MenuForm>
          <div className="my-1 border-t border-slate-200" />
          <form
            action={deleteFaq}
            onSubmit={(event) => {
              if (
                !confirm(
                  `¿Eliminar “${question}”? Esta acción no se puede deshacer.`,
                )
              )
                event.preventDefault();
              else setOpen(false);
            }}
            role="none"
          >
            <input name="id" type="hidden" value={id} />
            <button
              className="w-full px-4 py-2.5 text-left font-bold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600"
              role="menuitem"
            >
              Eliminar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MenuForm({
  action,
  children,
  label,
  onSubmit,
}: Readonly<{
  action: (form: FormData) => void | Promise<void>;
  children: React.ReactNode;
  label: string;
  onSubmit: () => void;
}>) {
  return (
    <form action={action} onSubmit={onSubmit} role="none">
      {children}
      <button
        className="w-full px-4 py-2.5 text-left font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-orange-500"
        role="menuitem"
      >
        {label}
      </button>
    </form>
  );
}
