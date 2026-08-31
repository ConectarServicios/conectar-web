import Image from "next/image";
import Link from "next/link";

import {
  eventDateFormatter,
  eventDayFormatter,
  eventMonthFormatter,
  eventTimeFormatter,
} from "@/lib/utils/event-dates";
import type { EventItem } from "@/types/events";

export function EventCard({
  item,
  imageUrl,
  subtle = false,
}: Readonly<{ item: EventItem; imageUrl: string | null; subtle?: boolean }>) {
  const start = item.starts_at ? new Date(item.starts_at) : null;
  const hasLegacyImage = /^https?:\/\//.test(item.image_path ?? "");

  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white ${subtle ? "shadow-sm" : "shadow-md"}`}
    >
      {imageUrl ? (
        <div className="relative aspect-[16/9] bg-slate-100">
          <Image
            alt={`Imagen de ${item.title}`}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={imageUrl}
            unoptimized={hasLegacyImage}
          />
        </div>
      ) : (
        <div className="aspect-[16/7] bg-gradient-to-br from-slate-100 to-blue-100" />
      )}
      <div className="flex gap-5 p-6">
        {start && (
          <div className="h-fit min-w-16 rounded-xl bg-[#092b4c] px-3 py-2 text-center text-white">
            <strong className="block text-2xl leading-none">
              {eventDayFormatter.format(start)}
            </strong>
            <span className="text-xs font-black uppercase">
              {eventMonthFormatter.format(start).replace(".", "")}
            </span>
          </div>
        )}
        <div>
          {item.featured && (
            <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-800">
              Destacado
            </span>
          )}
          <h2 className="mt-2 text-xl font-black text-slate-950">{item.title}</h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {item.summary}
          </p>
          {start && (
            <p className="mt-3 text-sm font-semibold text-slate-600">
              {eventDateFormatter.format(start)} · {eventTimeFormatter.format(start)} h
            </p>
          )}
          {item.location && <p className="mt-1 text-sm text-slate-500">{item.location}</p>}
          <Link
            className="mt-4 inline-flex font-bold text-orange-700"
            href={`/eventos/${item.slug}`}
          >
            Ver evento <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
