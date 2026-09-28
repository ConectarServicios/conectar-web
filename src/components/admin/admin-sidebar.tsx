"use client";

import { useState } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import type { AdminRole } from "@/types/admin";

type AdminSidebarProps = Readonly<{
  role: AdminRole;
}>;

function SidebarToggle({
  expanded,
  onToggle,
  className = "",
}: Readonly<{
  expanded: boolean;
  onToggle: () => void;
  className?: string;
}>) {
  return (
    <button
      aria-controls="admin-desktop-navigation"
      aria-expanded={expanded}
      aria-label={expanded ? "Contraer menú" : "Expandir menú"}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-700 text-xl leading-none text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${className}`}
      onClick={onToggle}
      type="button"
    >
      <span aria-hidden="true">{expanded ? "‹" : "›"}</span>
    </button>
  );
}

export function AdminSidebar({ role }: AdminSidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const sidebarWidth = expanded ? "w-72" : "w-[4.5rem]";

  return (
    <aside
      className={`sticky top-0 z-30 hidden h-dvh shrink-0 border-r border-slate-800 bg-slate-950 transition-[width] duration-200 lg:block ${sidebarWidth}`}
    >
      <div className={`flex h-16 items-center border-b border-slate-800 px-3 ${expanded ? "justify-between gap-3" : "flex-col justify-center gap-0.5"}`}>
        <div className={expanded ? "block" : "hidden"}>
          <p className="text-lg font-bold tracking-tight text-white">Conectar</p>
          <p className="text-xs font-medium tracking-[0.16em] text-orange-400 uppercase">Servicios · Admin</p>
        </div>
        <p aria-hidden="true" className={`text-lg font-bold text-white ${expanded ? "hidden" : "block"}`}>
          C
        </p>
        <SidebarToggle expanded={expanded} onToggle={() => setExpanded((current) => !current)} />
      </div>
      <div
        className={`h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain py-5 ${expanded ? "px-4" : "px-2"}`}
        id="admin-desktop-navigation"
      >
        <AdminNav compact={!expanded} role={role} />
      </div>
    </aside>
  );
}
