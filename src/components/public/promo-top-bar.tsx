import Link from "next/link";

import { getPublicPromotions } from "@/lib/supabase/promotions";

export async function PromoTopBar() {
  const [item] = await getPublicPromotions("top_bar", 1);
  if (!item) return null;
  const href = item.button_url || `/promociones/${item.slug}`;
  const external = /^https?:\/\//.test(href);

  return (
    <aside className="bg-orange-500 text-white" aria-label="Promoción vigente">
      <div className="public-container flex justify-center py-1.5 sm:py-2">
        <div className="flex min-h-9 max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1.5 rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-center text-xs shadow-sm sm:rounded-full sm:px-4 sm:text-sm">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm leading-none" aria-hidden="true">🔥</span>
          <p className="min-w-0 font-bold leading-5">{item.title}</p>
          <Link className="shrink-0 rounded-full bg-[#071a2f] px-3 py-1.5 text-xs font-extrabold text-white transition-colors hover:bg-[#0d2b49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-sm" href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {item.button_text || "Ver promoción"} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
