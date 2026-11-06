import Image from "next/image";
import styles from "./news-card.module.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { NewsItem } from "@/types/news";
import { argentinaDateFormatter } from "@/lib/utils/news-dates";
export function NewsCard({ item, imageUrl, variant = "default", headingAs: Heading = "h3" }: Readonly<{ item: NewsItem; imageUrl: string | null; variant?: "default" | "home"; headingAs?: "h2" | "h3" }>) {
  if (variant === "home") {
    return (
      <article data-home-news-card className={`${styles.card} group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#D7E4F2] bg-white shadow-sm transition duration-150 hover:border-[#B9CCE0] hover:shadow-md motion-reduce:transition-none`}>
        {imageUrl && (
          <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-[#EAF2FA]">
            <Image
              alt={`Portada de ${item.title}`}
              className="object-cover transition duration-300 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              src={imageUrl}
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {item.category && (
            <p className="w-fit max-w-full rounded-full bg-[#EAF2FA] px-3 py-1 text-xs leading-5 font-bold tracking-wide break-words text-[#315C88]">
              {item.category}
            </p>
          )}
          <Heading className="mt-3 text-xl leading-7 font-black break-words text-[#071C31]">{item.title}</Heading>
          {item.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.excerpt}</p>}
          <p className="mt-4 text-sm font-semibold text-slate-500">
            {item.published_at && argentinaDateFormatter.format(new Date(item.published_at))}
          </p>
          <div className="mt-auto pt-4">
            <Link
              data-home-action="card-link"
              aria-label={`Leer más: ${item.title}`}
              className={`${styles.link} inline-flex min-h-11 max-w-full items-center gap-2 rounded-sm text-sm font-bold text-[#315C88] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#315C88]`}
              href={`/noticias/${item.slug}`}
            >
              Leer más
              <ArrowRight aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </article>
    );
  }
 return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">{imageUrl && <div className="relative aspect-[16/9] overflow-hidden bg-slate-100"><Image alt={`Portada de ${item.title}`} className="object-cover transition duration-300 group-hover:scale-105" fill sizes="(max-width: 768px) 100vw, 33vw" src={imageUrl}/></div>}<div className="p-6"><p className="text-xs font-black tracking-widest text-orange-700 uppercase">{item.category}</p><h2 className="mt-2 text-xl font-black text-slate-950">{item.title}</h2>{item.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.excerpt}</p>}<p className="mt-4 text-sm font-semibold text-slate-500">{item.published_at && argentinaDateFormatter.format(new Date(item.published_at))}</p><Link className="mt-5 inline-flex min-h-11 w-fit max-w-full items-center justify-center rounded-xl border border-home-accent-strong bg-home-surface px-4 py-2 text-sm font-bold text-home-accent-strong transition-colors hover:bg-home-accent-strong hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-accent" href={`/noticias/${item.slug}`}>Leer más</Link></div></article>; }
