"use client";

import { usePublicSegment, type PublicSegment } from "@/components/public/public-segment-context";

const segments: { label: string; value: PublicSegment }[] = [
  { label: "Hogar", value: "hogar" },
  { label: "Corporativo", value: "corporativo" },
];

export function SegmentSelector({ className = "" }: Readonly<{ className?: string }>) {
  const { segment, setSegment } = usePublicSegment();

  return (
    <div
      className={`inline-flex rounded-full border border-white/15 bg-white/[0.06] p-1 ${className}`}
      role="group"
      aria-label="Elegir segmento del sitio"
    >
      {segments.map((item) => {
        const selected = segment === item.value;
        return (
          <button
            className={`min-h-9 rounded-full px-3.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              selected
                ? item.value === "hogar"
                  ? "bg-[#12b886] text-[#031d19] shadow-sm"
                  : "bg-[#2f6bff] text-white shadow-sm"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
            type="button"
            aria-pressed={selected}
            key={item.value}
            onClick={() => setSegment(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
