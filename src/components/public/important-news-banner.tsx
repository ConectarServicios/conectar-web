import { TriangleAlert } from "lucide-react";
import Link from "next/link";

import type { NewsItem } from "@/types/news";

type ImportantNewsBannerProps = Readonly<{
  item: NewsItem;
}>;

export function ImportantNewsBanner({ item }: ImportantNewsBannerProps) {
  return (
    <aside
      aria-label="Aviso importante"
      className="border-b border-amber-500/40 bg-amber-100 text-brand-navy-deep"
    >
      <div className="public-container">
        <div className="grid min-h-14 grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 py-2 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4">
          <TriangleAlert
            aria-hidden="true"
            className="size-5 shrink-0 text-amber-700 sm:size-6"
            strokeWidth={2.4}
          />

          <div className="min-w-0">
            <p className="hidden text-[0.68rem] font-black tracking-[0.14em] text-amber-800 uppercase sm:block">
              Aviso importante
            </p>
            <p className="line-clamp-2 text-sm leading-4 font-extrabold sm:line-clamp-1 sm:text-base sm:leading-5">
              {item.title}
            </p>
            {item.excerpt ? (
              <p className="mt-0.5 hidden truncate text-sm text-brand-navy/80 md:block">
                {item.excerpt}
              </p>
            ) : null}
          </div>

          <Link
            className="col-start-2 inline-flex min-h-8 w-fit items-center rounded-full border border-brand-navy-deep/25 px-3 py-1 text-xs font-extrabold whitespace-nowrap transition hover:border-brand-navy-deep hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-deep sm:col-start-auto sm:row-start-auto sm:px-4 sm:text-sm"
            href={`/noticias/${item.slug}`}
          >
            Ver comunicado
          </Link>
        </div>
      </div>
    </aside>
  );
}
