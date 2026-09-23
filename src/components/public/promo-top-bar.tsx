import Link from "next/link";

import { getPublicPromotions } from "@/lib/supabase/promotions";
import {
  isExternalPublicUrl,
  normalizePublicNavigationUrl,
} from "@/lib/utils/public-navigation-url";

export async function PromoTopBar() {
  const {
    data: [item],
  } = await getPublicPromotions("top_bar", 1);

  if (!item) return null;

  const href = normalizePublicNavigationUrl(
    item.button_url || `/promociones/${item.slug}`,
  );

  const external = isExternalPublicUrl(href);

  return (
    <aside
      className="border-b border-orange-700/20 bg-[#F28A2E] text-brand-navy-deep"
      aria-label="Promoción vigente"
    >
      <div className="public-container">
        <div className="flex h-14 items-center justify-center gap-2 text-center text-xs sm:min-h-12 sm:h-auto sm:gap-4 sm:py-2 sm:text-sm">
          <span
            className="hidden shrink-0 text-base sm:inline"
            aria-hidden="true"
          >
            🔥
          </span>

          <p className="min-w-0 font-extrabold leading-4 sm:leading-5">
            {item.title}
          </p>

          <Link
            className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-full bg-brand-navy-deep px-3 py-1 font-extrabold whitespace-nowrap text-white transition hover:bg-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-deep sm:gap-1.5 sm:px-4 sm:py-1.5"
            href={href}
            {...(external
              ? {
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {})}
          >
            {item.button_text || "Ver promoción"}
          </Link>
        </div>
      </div>
    </aside>
  );
}
