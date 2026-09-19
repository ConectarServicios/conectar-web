"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { PublicNavigationItem } from "@/components/public/public-navigation";
import { isNavigationItemActive } from "@/components/public/public-navigation";

export function DesktopNewsMenu({ item, linkClass }: Readonly<{
  item: PublicNavigationItem;
  linkClass: string;
}>) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = isNavigationItemActive(pathname, item);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button aria-expanded={open} className={`${linkClass} flex items-center gap-1 ${active ? "bg-white/10 text-white" : "text-slate-300"}`} onClick={() => setOpen((value) => !value)} type="button">
        {item.label}<ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && <div className="absolute left-0 top-full min-w-44 pt-2">
        <div className="rounded-xl border border-white/10 bg-brand-navy p-2 shadow-xl">
          {item.children?.map((child) => {
            const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
            return <Link aria-current={childActive ? "page" : undefined} className={`block rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white ${childActive ? "bg-white/10" : ""}`} href={child.href} key={child.href} onClick={() => setOpen(false)}>{child.label}</Link>;
          })}
        </div>
      </div>}
    </div>
  );
}
