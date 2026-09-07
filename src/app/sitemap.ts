import type { MetadataRoute } from "next";

import { getPublicSitemapRecords } from "@/lib/supabase/sitemap";
import { getSiteUrl } from "@/lib/utils/site-url";

const staticRoutes = [
  "/",
  "/servicios",
  "/conectar-play",
  "/promociones",
  "/noticias",
  "/eventos",
  "/preguntas-frecuentes",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const records = await getPublicSitemapRecords();
  const entry = (path: string, lastModified?: string | null) => ({
    url: new URL(path, siteUrl).toString(),
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    ...staticRoutes.map((route) => entry(route)),
    ...records.areas.map((item) => entry(`/servicios/${item.slug}`, item.updated_at)),
    ...records.news.map((item) => entry(`/noticias/${item.slug}`, item.updated_at)),
    ...records.events.map((item) => entry(`/eventos/${item.slug}`, item.updated_at)),
    ...records.promotions.map((item) => entry(`/promociones/${item.slug}`, item.updated_at)),
  ];
}
