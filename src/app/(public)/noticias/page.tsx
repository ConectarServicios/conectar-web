import type { Metadata } from "next";
import { NewsCard } from "@/components/public/news-card";
import { getPublicNews, newsImageUrl } from "@/lib/supabase/news";
import { createClient } from "@/lib/supabase/server";
export const metadata: Metadata = { title:"Noticias y comunicados | Conectar Servicios", description:"Novedades, comunicados e información institucional de Conectar Servicios.", alternates: { canonical: "/noticias" } };
export default async function NewsPage() {
  const result = await getPublicNews();
  const items = result.data;
  const supabase = await createClient();

  return (
    <main>
      <section className="bg-[#071C31] py-8 text-white sm:py-10">
        <div className="public-container">
          <p className="text-xs font-black tracking-[.18em] text-[#FFAD52] uppercase">Actualidad</p>
          <h1 className="mt-3 text-3xl leading-tight font-black tracking-tight text-balance sm:text-4xl">Noticias y comunicados</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#D7E4F2]">Información y novedades de Conectar Servicios.</p>
        </div>
      </section>
      <section className="bg-[#F7F9FC] py-10 sm:py-14">
        <div className="public-container">
          {result.unavailable ? (
            <div className="public-empty-state" role="status">
              <h2 className="text-xl font-bold text-slate-900">Las noticias no están disponibles temporalmente.</h2>
              <p className="mt-2">Intentá nuevamente más tarde.</p>
            </div>
          ) : items.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <NewsCard
                  imageUrl={newsImageUrl(supabase, item.cover_image)}
                  item={item}
                  key={item.id}
                  variant="home"
                  headingAs="h2"
                />
              ))}
            </div>
          ) : (
            <div className="public-empty-state">
              <h2 className="text-xl font-bold text-slate-900">Todavía no hay publicaciones</h2>
              <p className="mt-2">Volvé pronto para conocer nuestras novedades.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
