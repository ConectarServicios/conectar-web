import Image from "next/image";
import Link from "next/link";

import { PromotionCard } from "@/components/public/promotion-card";
import { createClient } from "@/lib/supabase/server";
import { getPublicPromotions, promotionImageUrl } from "@/lib/supabase/promotions";
import { argentinaDateFormatter } from "@/lib/utils/news-dates";
import type { Promotion, PromotionPlacement } from "@/types/promotions";

function WideContextualPromotion({ item, imageUrl }: Readonly<{ item: Promotion; imageUrl: string | null }>) {
  const href = item.button_url || `/promociones/${item.slug}`;
  const external = /^https?:\/\//.test(href);

  return (
    <article className="group overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-slate-950/15 md:grid md:grid-cols-[minmax(18rem,2fr)_3fr]">
      <div className="relative min-h-56 bg-gradient-to-br from-[#0b2440] to-[#164b75] md:min-h-72">
        {imageUrl ? (
          <Image
            alt=""
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            src={imageUrl}
            unoptimized
          />
        ) : (
          <div className="grid h-full min-h-56 place-items-center text-6xl md:min-h-72" aria-hidden="true">🎁</div>
        )}
        {item.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
            Destacada
          </span>
        )}
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <h3 className="text-2xl font-black tracking-tight text-[#071a2f] sm:text-3xl">
          <Link href={`/promociones/${item.slug}`}>{item.title}</Link>
        </h3>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">{item.summary}</p>
        {item.ends_at && (
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Válida hasta el {argentinaDateFormatter.format(new Date(item.ends_at))}
          </p>
        )}
        <Link
          className="mt-6 inline-flex w-fit font-black text-orange-700"
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {item.button_text || "Ver promoción"} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export async function ContextualPromotions({ placement, exclude = [] }: Readonly<{ placement: PromotionPlacement; exclude?: string[] }>) {
  const all = await getPublicPromotions(placement);
  const items = all.filter((item) => !exclude.includes(item.id)).slice(0, 2);
  if (!items.length) return null;
  const supabase = await createClient();
  return (
    <section className="bg-[#0b2440] py-16 text-white">
      <div className="public-container">
        <p className="text-xs font-black uppercase tracking-[.2em] text-orange-400">Beneficios exclusivos</p>
        <h2 className="mt-3 text-3xl font-black">Promociones para aprovechar</h2>
        {items.length === 1 ? (
          <div className="mt-8">
            <WideContextualPromotion imageUrl={promotionImageUrl(supabase, items[0].image_path)} item={items[0]} />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {items.map((item) => <PromotionCard compact imageUrl={promotionImageUrl(supabase, item.image_path)} item={item} key={item.id} />)}
          </div>
        )}
      </div>
    </section>
  );
}
