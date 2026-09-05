"use client";

import { useState, type ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { AdminRole } from "@/types/admin";

type AdminShellProps = Readonly<{
  children: ReactNode;
  role: AdminRole;
}>;

export function AdminShell({ children, role }: AdminShellProps) {
  const [manualExpanded, setManualExpanded] = useState<boolean | null>(null);

  function toggleSidebar() {
    setManualExpanded((current) => {
      if (current !== null) return !current;

      return !window.matchMedia("(min-width: 1440px)").matches;
    });
  }

  const contentPadding =
    manualExpanded === null
      ? "lg:pl-16 min-[1440px]:pl-72"
      : manualExpanded
        ? "lg:pl-72"
        : "lg:pl-16";

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        expanded={manualExpanded}
        onToggle={toggleSidebar}
        role={role}
      />
      <div
        className={`min-h-screen transition-[padding] duration-200 ${contentPadding}`}
      >
        {children}
      </div>
    </div>
  );
}
