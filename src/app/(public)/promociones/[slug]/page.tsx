import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicPromotion, promotionImageUrl } from "@/lib/supabase/promotions";
import { createClient } from "@/lib/supabase/server";
import { argentinaDateFormatter } from "@/lib/utils/news-dates";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicPromotion(slug);
  if (!item) return {};
  const supabase = await createClient();
  const image = promotionImageUrl(supabase, item.image_path);
  return {
    title: `${item.title} | Conectar Servicios`,
    description: item.summary,
    openGraph: { title: item.title, description: item.summary, ...(image ? { images: [image] } : {}) },
  };
}

export default async function PromotionDetail({ params }: Props) {
  const { slug } = await params;
  const item = await getPublicPromotion(slug);
  if (!item) notFound();
  const supabase = await createClient();
  const image = promotionImageUrl(supabase, item.image_path);
  const href = item.button_url;

  return (
    <main><article className="py-12 sm:py-20"><div className="public-container max-w-5xl">
      <Link className="font-bold text-orange-700" href="/promociones">← Volver a Promociones</Link>
      {image && <div className="relative mt-8 aspect-[16/7] overflow-hidden rounded-3xl bg-slate-100">
        <Image alt="" className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 1024px" src={image} unoptimized />
      </div>}
      <div className="mx-auto mt-10 max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight text-[#071a2f] sm:text-6xl">{item.title}</h1>
        <p className="mt-6 text-xl leading-8 text-slate-600">{item.summary}</p>
        {(item.starts_at || item.ends_at) && <p className="mt-5 text-sm font-bold text-slate-500">
          {item.starts_at && `Desde el ${argentinaDateFormatter.format(new Date(item.starts_at))}`}
          {item.starts_at && item.ends_at ? " · " : ""}
          {item.ends_at && `Hasta el ${argentinaDateFormatter.format(new Date(item.ends_at))}`}
        </p>}
        <div className="mt-10 whitespace-pre-line text-lg leading-8 text-slate-700">{item.description}</div>
        {href && <Link className="public-button-primary mt-10" href={href}
          {...(/^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {item.button_text || "Más información"}
        </Link>}
      </div>
    </div></article></main>
  );
}
