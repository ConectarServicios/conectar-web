import type { Metadata } from "next";

import { PromotionCard } from "@/components/public/promotion-card";
import { getPublicPromotions, promotionImageUrl } from "@/lib/supabase/promotions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Promociones | Conectar Servicios",
  description: "Conocé los beneficios y promociones vigentes de Conectar Servicios.",
};

export default async function PromotionsPage() {
  const items = await getPublicPromotions();
  const supabase = await createClient();
  return (
    <main>
      <section className="bg-[#071a2f] py-16 text-white sm:py-24">
        <div className="public-container">
          <p className="text-sm font-black uppercase tracking-[.2em] text-orange-400">Promociones</p>
          <h1 className="mt-4 text-4xl font-black sm:text-6xl">Beneficios pensados para vos</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">Descubrí oportunidades vigentes para disfrutar más de nuestros servicios.</p>
        </div>
      </section>
      <section className="py-16 sm:py-24"><div className="public-container">
        {items.length ? <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <PromotionCard imageUrl={promotionImageUrl(supabase, item.image_path)} item={item} key={item.id} />)}
        </div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <h2 className="text-2xl font-black">No hay promociones vigentes por el momento</h2>
          <p className="mt-3 text-slate-600">Volvé pronto para conocer nuevos beneficios.</p>
        </div>}
      </div></section>
    </main>
  );
}
