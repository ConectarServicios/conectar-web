"use client";

import { useId, useState } from "react";

export type AccordionFaq = { id: string; question: string; answer: string };

export function FaqAccordion({
  compact = false,
  items,
}: Readonly<{ compact?: boolean; items: AccordionFaq[] }>) {
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
                : "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            }
            key={item.id}
          >
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={open}
                className={`flex w-full items-start justify-between gap-5 text-left font-bold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${compact ? "py-4 text-base" : "p-5 text-lg sm:p-6"}`}
                onClick={() => toggle(item.id)}
                type="button"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className="shrink-0 text-2xl font-normal leading-6 text-orange-600"
                >
                  {open ? "−" : "+"}
                </span>
              </button>
            </h3>
            {open && (
              <div
                className={`whitespace-pre-line leading-7 text-slate-600 ${compact ? "pb-5 pr-8" : "border-t border-slate-100 px-5 py-5 sm:px-6"}`}
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
