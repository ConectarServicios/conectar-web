import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/utils/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return siteUrl ? [{ url: new URL("/", siteUrl).toString() }] : [];
}
