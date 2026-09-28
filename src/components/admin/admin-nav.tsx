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
  compact?: boolean;
}>;

export function AdminNav({ role, onNavigate, compact = false }: AdminNavProps) {
  const pathname = usePathname();
  const items = getNavigationForRole(role);

  return (
    <nav aria-label="Navegación administrativa" className={compact ? "space-y-3" : "space-y-6"}>
      {ADMIN_NAVIGATION_SECTIONS.map((section) => {
        const sectionItems = items.filter((item) => item.section === section);
        if (sectionItems.length === 0) return null;

        return (
          <div key={section}>
            <p className={`mb-2 px-3 text-[0.68rem] font-bold tracking-[0.18em] text-slate-500 uppercase ${compact ? "sr-only" : ""}`}>
              {section}
            </p>
            <ul className="space-y-1">
              {sectionItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" &&
                    pathname.startsWith(`${item.href}/`));
                return (
                  <li key={item.href}>
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      aria-label={compact ? item.label : undefined}
                      className={`group flex min-h-11 items-center rounded-lg text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${compact ? "justify-center px-2" : "gap-3 px-3"} ${
                        isActive
                          ? "bg-orange-500 text-slate-950 shadow-sm"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                      href={item.href}
                      onClick={onNavigate}
                    >
                      <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
                      <span className={compact ? "sr-only" : ""}>{item.label}</span>
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
