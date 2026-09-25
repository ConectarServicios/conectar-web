"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const segments = [
  { href: "/hogar", label: "Hogar", value: "hogar" },
  { href: "/corporativo", label: "Corporativo", value: "corporativo" },
] as const;

export function SegmentSelector({
  className = "",
  onNavigate,
}: Readonly<{ className?: string; onNavigate?: () => void }>) {
  const pathname = usePathname();

  return (
    <div
      className={`inline-flex rounded-full border border-white/15 bg-white/[0.06] p-0.5 sm:p-1 ${className}`}
      aria-label="Elegir audiencia del sitio"
    >
      {segments.map((item) => {
        const selected = pathname === item.href ||
          (item.value === "hogar" && pathname === "/conectar-play");
        return (
          <Link
            aria-current={selected ? "page" : undefined}
            className={`flex min-h-9 items-center rounded-full px-2.5 text-[0.6875rem] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-3.5 sm:text-xs ${
              selected
                ? item.value === "hogar"
                  ? "home-gradient text-[#031d19] shadow-sm"
                  : "bg-corporate-accent text-white shadow-sm"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
            href={item.href}
            key={item.value}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
