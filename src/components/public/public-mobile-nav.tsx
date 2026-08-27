"use client";

import { useState } from "react";

type NavigationItem = {
  href: string;
  label: string;
};

export function PublicMobileNav({ items }: Readonly<{ items: NavigationItem[] }>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        className="grid size-11 place-items-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded={open}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((current) => !current)}
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
        >
          {items.map((item) => (
            <a
              className="block rounded-xl px-4 py-3 font-semibold text-slate-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-orange-400"
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
