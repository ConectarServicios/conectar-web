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
      className="mb-6 grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-3 rounded-2xl border border-amber-300/60 bg-amber-100/[0.12] px-4 py-4 text-white shadow-sm shadow-slate-950/25 backdrop-blur-sm sm:px-6 sm:py-5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-x-5"
    >
      <TriangleAlert
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0 text-amber-300 sm:size-6 md:mt-0"
        strokeWidth={2.4}
      />

      <div className="min-w-0">
        <p className="text-[0.65rem] font-black tracking-[0.14em] text-amber-300 uppercase">
          Aviso importante
        </p>
        <p className="mt-1 line-clamp-3 text-sm leading-5 font-extrabold text-white sm:line-clamp-2 sm:text-base">
          {item.title}
        </p>
        {item.excerpt ? (
          <p className="mt-1.5 hidden text-xs leading-5 text-slate-200 min-[390px]:line-clamp-2 sm:text-sm">
            {item.excerpt}
          </p>
        ) : null}
      </div>

      <Link
        className="col-start-2 inline-flex min-h-9 w-fit items-center rounded-full border border-amber-300/50 bg-amber-300/10 px-3.5 py-1.5 text-xs font-extrabold whitespace-nowrap text-amber-100 transition hover:border-amber-200 hover:bg-amber-300/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 md:col-start-auto md:px-4 md:text-sm"
        href={`/noticias/${item.slug}`}
      >
        Ver comunicado
      </Link>
    </aside>
  );
}
