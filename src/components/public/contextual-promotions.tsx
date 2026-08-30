import { PromotionCard } from "@/components/public/promotion-card";
import { createClient } from "@/lib/supabase/server";
import { getPublicPromotions, promotionImageUrl } from "@/lib/supabase/promotions";
import type { PromotionPlacement } from "@/types/promotions";

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
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((item) => <PromotionCard compact imageUrl={promotionImageUrl(supabase, item.image_path)} item={item} key={item.id} />)}
        </div>
      </div>
    </section>
  );
}
