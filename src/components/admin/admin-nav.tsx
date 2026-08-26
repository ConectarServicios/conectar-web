"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ADMIN_NAVIGATION_SECTIONS,
  getNavigationForRole,
} from "@/components/admin/admin-navigation";
import type { AdminRole } from "@/types/admin";

type AdminNavProps = Readonly<{
  role: AdminRole;
  onNavigate?: () => void;
}>;

export function AdminNav({ role, onNavigate }: AdminNavProps) {
  const pathname = usePathname();
  const items = getNavigationForRole(role);

  return (
    <nav aria-label="Navegación administrativa" className="space-y-6">
      {ADMIN_NAVIGATION_SECTIONS.map((section) => {
        const sectionItems = items.filter((item) => item.section === section);
        if (sectionItems.length === 0) return null;

        return (
          <div key={section}>
            <p className="mb-2 px-3 text-[0.68rem] font-bold tracking-[0.18em] text-slate-500 uppercase">
              {section}
            </p>
            <ul className="space-y-1">
              {sectionItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${
                        isActive
                          ? "bg-orange-500 text-slate-950 shadow-sm"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                      href={item.href}
                      onClick={onNavigate}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-slate-950" : "bg-slate-600 group-hover:bg-orange-400"}`}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
