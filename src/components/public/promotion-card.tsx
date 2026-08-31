import Image from "next/image";
import Link from "next/link";

import { argentinaDateFormatter } from "@/lib/utils/news-dates";
import type { Promotion } from "@/types/promotions";

export function PromotionCard({ item, imageUrl, compact = false }: Readonly<{
  item: Promotion; imageUrl: string | null; compact?: boolean;
}>) {
  const href = item.button_url || `/promociones/${item.slug}`;
  const external = /^https?:\/\//.test(href);
  return (
    <article className="group overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-slate-950/8">
      <div className="relative h-48 bg-gradient-to-br from-[#0b2440] to-[#164b75]">
        {imageUrl ? <Image alt="" className="object-cover transition duration-300 group-hover:scale-[1.02]" fill sizes="(max-width: 768px) 100vw, 33vw" src={imageUrl} unoptimized />
          : <div className="grid h-full place-items-center text-5xl" aria-hidden="true">🎁</div>}
        {item.featured && <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">Destacada</span>}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-black tracking-tight text-[#071a2f]"><Link href={`/promociones/${item.slug}`}>{item.title}</Link></h3>
        <p className={`mt-3 leading-7 text-slate-600 ${compact ? "line-clamp-2" : ""}`}>{item.summary}</p>
        {item.ends_at && <p className="mt-4 text-sm font-semibold text-slate-500">Válida hasta el {argentinaDateFormatter.format(new Date(item.ends_at))}</p>}
        <Link className="mt-5 inline-flex font-black text-orange-700" href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {item.button_text || "Ver promoción"} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
