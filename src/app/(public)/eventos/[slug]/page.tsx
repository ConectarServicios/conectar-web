import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { EVENT_SELECT, eventImageUrl } from "@/lib/supabase/events";
import { createClient } from "@/lib/supabase/server";
import { eventDateFormatter, eventTimeFormatter } from "@/lib/utils/event-dates";
import type { EventItem } from "@/types/events";

const loadEvent = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Unable to load event detail", error);
    return null;
  }
  return data as EventItem | null;
});

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const item = await loadEvent(slug);
  if (!item) return { title: "Evento no encontrado" };

  const supabase = await createClient();
  const image = eventImageUrl(supabase, item.image_path);
  return {
    title: `${item.title} | Conectar Servicios`,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function EventDetail({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const item = await loadEvent(slug);
  if (!item) notFound();

  const supabase = await createClient();
  const image = eventImageUrl(supabase, item.image_path);
  const start = item.starts_at ? new Date(item.starts_at) : null;
  const end = item.ends_at ? new Date(item.ends_at) : null;
  const externalCta = /^https?:\/\//.test(item.button_url ?? "");
  const legacyImage = /^https?:\/\//.test(item.image_path ?? "");

  return (
    <main className="bg-slate-50 py-12 sm:py-20">
      <article className="public-container max-w-4xl">
        <Link className="font-bold text-orange-700" href="/eventos">
          ← Volver a Eventos
        </Link>
        <header className="mt-8">
          <p className="public-eyebrow">Agenda</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            {item.title}
          </h1>
          <p className="mt-7 text-xl leading-8 text-slate-600">{item.summary}</p>
        </header>

        {image && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-slate-200">
            <Image
              alt={`Imagen de ${item.title}`}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              src={image}
              unoptimized={legacyImage}
            />
          </div>
        )}

        <dl className="mt-10 grid gap-5 rounded-2xl border bg-white p-6 sm:grid-cols-2">
          {start && (
            <div>
              <dt className="text-xs font-black uppercase tracking-wider text-orange-700">
                Fecha y hora
              </dt>
              <dd className="mt-1 font-bold">
                {eventDateFormatter.format(start)} · {eventTimeFormatter.format(start)} h
                {end && (
                  <> — {eventDateFormatter.format(end)} · {eventTimeFormatter.format(end)} h</>
                )}
              </dd>
            </div>
          )}
          {item.location && (
            <div>
              <dt className="text-xs font-black uppercase tracking-wider text-orange-700">
                Lugar
              </dt>
              <dd className="mt-1 font-bold">{item.location}</dd>
              {item.address && <dd className="text-slate-600">{item.address}</dd>}
            </div>
          )}
        </dl>

        <div className="mt-10 whitespace-pre-wrap text-lg leading-8 text-slate-700">
          {item.description}
        </div>
        {item.button_text && item.button_url && (
          <a
            className="public-button-primary mt-10"
            href={item.button_url}
            rel={externalCta ? "noopener noreferrer" : undefined}
            target={externalCta ? "_blank" : undefined}
          >
            {item.button_text}
          </a>
        )}
      </article>
    </main>
  );
}
