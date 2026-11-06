import Image from "next/image";
import Link from "next/link";

import { MeshPricingSection } from "@/components/public/mesh-pricing-section";
import { argentinaDateFormatter } from "@/lib/utils/news-dates";
import type { NewsItem } from "@/types/news";

export function MeshNewsArticle({
  item,
  image,
}: Readonly<{ item: NewsItem; image: string | null }>) {
  return (
    <main>
      <article>
        <header className="bg-[#071C31] py-8 text-white sm:py-12">
          <div className="public-container">
            <Link
              className="inline-flex min-h-11 items-center rounded-sm text-sm font-bold text-[#D7E4F2] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D7E4F2] motion-reduce:transition-none"
              href="/noticias"
            >
              ← Volver a Noticias
            </Link>
            <div className={image ? "mt-5 grid items-center gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10" : "mt-5 max-w-4xl"}>
              <div className="min-w-0">
                <p className="text-xs font-black tracking-[.18em] text-[#D7E4F2] uppercase">{item.category}</p>
                <h1 className="mt-3 text-3xl leading-tight font-black tracking-tight text-balance sm:text-4xl">{item.title}</h1>
                {item.published_at && (
                  <time className="mt-4 block text-sm text-[#D7E4F2]" dateTime={item.published_at}>
                    {argentinaDateFormatter.format(new Date(item.published_at))}
                  </time>
                )}
                {item.excerpt && <p className="mt-4 max-w-2xl text-sm leading-6 text-[#D7E4F2] sm:text-base sm:leading-7">{item.excerpt}</p>}
              </div>
              {image && (
                <div className="relative aspect-[16/9] min-w-0 overflow-hidden rounded-2xl border border-[#D7E4F2]/25 bg-[#315C88]/20 shadow-lg shadow-black/15">
                  <Image
                    alt={`Portada de ${item.title}`}
                    className="object-cover"
                    fill
                    priority
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    src={image}
                  />
                </div>
              )}
            </div>
          </div>
        </header>
        <section className="bg-[#F7F9FC] py-10 sm:py-14">
          <div className="public-container max-w-4xl whitespace-pre-wrap text-base leading-8 break-words text-slate-700 sm:text-lg">
            {item.content}
          </div>
        </section>
        <MeshPricingSection />
      </article>
    </main>
  );
}
