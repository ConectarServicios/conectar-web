import Link from "next/link";

import { getPublicPromotions } from "@/lib/supabase/promotions";

export async function PromoTopBar() {
  const [item] = await getPublicPromotions("top_bar", 1);
  if (!item) return null;
  const href = item.button_url || `/promociones/${item.slug}`;
  const external = /^https?:\/\//.test(href);

  return (
    <aside className="bg-orange-500 text-white" aria-label="Promoción vigente">
      <div className="public-container flex min-h-10 items-center justify-center gap-3 py-2 text-center text-sm">
        <span aria-hidden="true">🔥</span>
        <p className="line-clamp-1 font-bold">{item.title}</p>
        <Link className="shrink-0 rounded-md bg-[#071a2f] px-3 py-1 font-black" href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {item.button_text || "Ver promoción"} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </aside>
  );
}
