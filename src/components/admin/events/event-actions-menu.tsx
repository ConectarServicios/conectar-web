"use client";

import { useEffect, useId, useRef, useState } from "react";

import {
  deleteEvent,
  toggleEventFeatured,
  updateEventStatus,
} from "@/app/admin/events/actions";
import type { EventStatus } from "@/types/events";

export function EventActionsMenu({
  featured,
  id,
  status,
  title,
}: Readonly<{
  featured: boolean;
  id: string;
  status: EventStatus;
  title: string;
}>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-orange-500"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        Acciones <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <div
          aria-label={`Acciones para ${title}`}
          className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
          id={menuId}
          role="menu"
        >
          <MenuForm
            action={updateEventStatus}
            label={status === "published" ? "A borrador" : "Publicar"}
            onSubmit={close}
          >
            <input name="id" type="hidden" value={id} />
            <input
              name="status"
              type="hidden"
              value={status === "published" ? "draft" : "published"}
            />
          </MenuForm>
          {status !== "archived" && (
            <MenuForm action={updateEventStatus} label="Archivar" onSubmit={close}>
              <input name="id" type="hidden" value={id} />
              <input name="status" type="hidden" value="archived" />
            </MenuForm>
          )}
          <MenuForm
            action={toggleEventFeatured}
            label={featured ? "Quitar destacado" : "Destacar"}
            onSubmit={close}
          >
            <input name="id" type="hidden" value={id} />
            <input name="featured" type="hidden" value={String(!featured)} />
          </MenuForm>
          <div className="my-1 border-t border-slate-200" />
          <form
            action={deleteEvent}
            onSubmit={(event) => {
              if (!confirm(`¿Eliminar “${title}”? Esta acción no se puede deshacer.`)) {
                event.preventDefault();
                return;
              }
              close();
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
