import Link from "next/link";
import { NewsCard } from "@/components/public/news-card";
import type { NewsItem } from "@/types/news";

export function NewsHomeSection({
  items,
  imageUrls,
}: Readonly<{ items: NewsItem[]; imageUrls: Record<string, string | null> }>) {
  if (!items.length) return null;

  return (
    <section className="bg-[#F7F9FC] py-16 sm:py-20">
      <div className="public-container">
        <p className="public-eyebrow">Actualidad</p>
        <h2 className="public-heading mt-3 text-[#071C31]">Novedades</h2>
        <p className="mt-3 text-lg text-slate-600">Noticias y comunicados de Conectar Servicios.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((item) => (
            <NewsCard imageUrl={imageUrls[item.id]} item={item} key={item.id} variant="home" />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            className="inline-flex min-h-12 max-w-full items-center justify-center rounded-xl border border-[#B9CCE0] bg-[#315C88] px-6 py-3 text-center font-bold text-white transition duration-150 hover:brightness-110 motion-safe:hover:-translate-y-px motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#315C88]"
            href="/noticias"
          >
            Ver todas las novedades
          </Link>
        </div>
      </div>
    </section>
  );
}
