import { TriangleAlert } from "lucide-react";
import Link from "next/link";

import type { NewsItem } from "@/types/news";

type ImportantNewsBannerProps = Readonly<{
  item: NewsItem;
}>;

export function ImportantNewsBanner({ item }: ImportantNewsBannerProps) {
  return (
    <section className="bg-white py-4 sm:py-6">
      <div className="public-container">
        <aside
          aria-label="Aviso importante"
          className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-3 rounded-2xl border border-amber-300/80 bg-amber-50 px-4 py-4 text-brand-navy-deep shadow-sm sm:rounded-3xl sm:px-6 sm:py-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-5"
        >
          <TriangleAlert
            aria-hidden="true"
            className="mt-0.5 size-6 shrink-0 text-amber-700 sm:size-7 lg:mt-0"
            strokeWidth={2.4}
          />

          <div className="min-w-0">
            <p className="text-[0.68rem] font-black tracking-[0.14em] text-amber-800 uppercase">
              Aviso importante
            </p>
            <p className="mt-1 line-clamp-3 text-base leading-5 font-extrabold sm:line-clamp-2 sm:text-lg sm:leading-6">
              {item.title}
            </p>
            {item.excerpt ? (
              <p className="mt-1.5 line-clamp-3 text-sm leading-5 text-brand-navy/80 sm:line-clamp-2">
                {item.excerpt}
              </p>
            ) : null}
          </div>

          <Link
            className="col-start-2 inline-flex min-h-10 w-fit items-center rounded-full bg-brand-navy-deep px-4 py-2 text-sm font-extrabold whitespace-nowrap text-white transition hover:bg-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-deep lg:col-start-auto"
            href={`/noticias/${item.slug}`}
          >
            Ver comunicado
          </Link>
        </aside>
      </div>
    </section>
  );
}
