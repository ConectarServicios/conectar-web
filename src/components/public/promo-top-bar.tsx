import Link from "next/link";

import { isExternalPublicUrl, normalizePublicNavigationUrl } from "@/lib/utils/public-navigation-url";
import { getPublicPromotions } from "@/lib/supabase/promotions";

export async function PromoTopBar() {
  const { data: [item] } = await getPublicPromotions("top_bar", 1);
  if (!item) return null;
  const href = normalizePublicNavigationUrl(item.button_url || `/promociones/${item.slug}`);
  const external = isExternalPublicUrl(href);

  return (
    <aside className="bg-slate-50 py-2 text-slate-900" aria-label="Promoción vigente">
      <div className="public-container">
        <div className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-orange-200/80 bg-white px-3 py-2 text-center text-sm shadow-sm shadow-slate-950/5 sm:flex-nowrap sm:rounded-full sm:py-1.5 sm:pl-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-orange-100 text-base" aria-hidden="true">🔥</span>
          <p className="min-w-0 font-bold leading-5">{item.title}</p>
          <Link className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-full bg-orange-100 px-3 py-1 font-extrabold text-orange-800 transition-colors hover:bg-orange-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600" href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {item.button_text || "Ver promoción"} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
