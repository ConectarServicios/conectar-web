"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { ServiceSegment } from "@/data/services/types";

type CatalogPanel = Readonly<{
  slug: ServiceSegment;
  title: string;
  description: string;
  groupIds: readonly string[];
  content: ReactNode;
}>;

function subscribeToFragment(listener: () => void) {
  window.addEventListener("hashchange", listener);
  window.addEventListener("popstate", listener);
  return () => {
    window.removeEventListener("hashchange", listener);
    window.removeEventListener("popstate", listener);
  };
}

const getFragment = () => window.location.hash.slice(1);
const getServerFragment = () => "";

export function ServiceCatalogSwitcher({ panels }: Readonly<{ panels: readonly CatalogPanel[] }>) {
  const searchParams = useSearchParams();
  const fragment = useSyncExternalStore(subscribeToFragment, getFragment, getServerFragment);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const requested = searchParams.get("tipo");
  const fragmentPanel = panels.find((panel) =>
    panel.groupIds.includes(fragment) || fragment === panel.slug || fragment === `${panel.slug}-title`,
  );
  const active = requested === "hogar" || requested === "corporativo"
    ? requested
    : fragmentPanel?.slug ?? "hogar";

  useEffect(() => {
    if (!fragment) return;
    document.getElementById(fragment)?.scrollIntoView({ block: "start" });
  }, [fragment, active]);

  function selectSegment(segment: ServiceSegment) {
    if (searchParams.get("tipo") === segment && !fragment) return;
    const url = new URL(window.location.href);
    url.searchParams.set("tipo", segment);
    url.hash = "";
    window.history.pushState(null, "", `${url.pathname}${url.search}`);
  }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    const index = panels.findIndex((panel) => panel.slug === active);
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % panels.length; break;
      case "ArrowLeft": next = (index - 1 + panels.length) % panels.length; break;
      case "Home": next = 0; break;
      case "End": next = panels.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectSegment(panels[next].slug);
    tabs.current[next]?.focus();
  }

  return (
    <>
      <div className="inline-flex w-full max-w-md gap-1 rounded-2xl border border-[#D7E4F2] bg-white p-1 shadow-sm" role="tablist" aria-label="Tipo de servicios" onKeyDown={handleKeys}>
        {panels.map((panel, index) => (
          <button
            aria-controls={`services-panel-${panel.slug}`}
            aria-selected={active === panel.slug}
            className={`min-h-12 min-w-0 flex-1 rounded-xl px-4 py-3 text-sm font-extrabold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-accent-strong motion-reduce:transition-none ${active === panel.slug ? "bg-[#071C31] text-white" : "text-[#315C88] hover:bg-[#EAF2FA]"}`}
            id={`services-tab-${panel.slug}`}
            key={panel.slug}
            onClick={() => selectSegment(panel.slug)}
            ref={(element) => { tabs.current[index] = element; }}
            role="tab"
            tabIndex={active === panel.slug ? 0 : -1}
            type="button"
          >
            {panel.title}
          </button>
        ))}
      </div>
      {panels.map((panel) => (
        <section
          aria-labelledby={`services-tab-${panel.slug}`}
          className="mt-8 min-w-0"
          hidden={active !== panel.slug}
          id={`services-panel-${panel.slug}`}
          key={panel.slug}
          role="tabpanel"
        >
          <h2 className="scroll-mt-24 text-2xl font-black tracking-tight text-[#071C31] sm:text-3xl" id={`${panel.slug}-title`}>{panel.title}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">{panel.description}</p>
          {panel.content}
        </section>
      ))}
    </>
  );
}
