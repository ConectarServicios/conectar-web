"use client";

import { useId, useState } from "react";

export type AccordionFaq = { id: string; question: string; answer: string };

export function FaqAccordion({
  compact = false,
  items,
  variant = "default",
}: Readonly<{ compact?: boolean; items: AccordionFaq[]; variant?: "default" | "home" }>) {
  const isHome = variant === "home";
  const instanceId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return (
    <div className={compact ? "divide-y divide-slate-200" : "space-y-3"}>
      {items.map((item) => {
        const open = openIds.has(item.id);
        const panelId = `${instanceId}-${item.id}`.replace(/:/g, "");
        return (
          <article
            className={
              compact
                ? "py-1"
                : `overflow-hidden rounded-2xl border bg-white shadow-sm ${isHome ? "border-[#D7E4F2]" : "border-slate-200"}`
            }
            key={item.id}
          >
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={open}
                className={`flex w-full items-start justify-between gap-5 text-left font-bold focus-visible:outline-2 focus-visible:outline-offset-2 ${isHome ? "text-[#071C31] focus-visible:outline-[#315C88]" : "text-slate-950 focus-visible:outline-orange-500"} ${compact ? "py-4 text-base" : "p-5 text-lg sm:p-6"}`}
                onClick={() => toggle(item.id)}
                type="button"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className={`shrink-0 text-2xl font-normal leading-6 ${isHome ? "text-[#315C88]" : "text-orange-600"}`}
                >
                  {open ? "−" : "+"}
                </span>
              </button>
            </h3>
            {open && (
              <div
                className={`whitespace-pre-line leading-7 text-slate-600 ${compact ? "pb-5 pr-8" : `border-t px-5 py-5 sm:px-6 ${isHome ? "border-[#D7E4F2]" : "border-slate-100"}`}`}
                id={panelId}
              >
                {item.answer}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
