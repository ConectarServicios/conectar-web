import { isSafeExternalHttpUrl } from "@/lib/validations/public-urls";
import type { ReactNode } from "react";

export function LegacyServiceImage({
  alt,
  className,
  fallback,
  src,
}: Readonly<{ alt: string; className?: string; fallback: ReactNode; src: string | null }>) {
  if (!src || !isSafeExternalHttpUrl(src)) return fallback;

  // Legacy service URLs can point to any valid external host, so they bypass
  // Next/Image instead of weakening the global remotePatterns allowlist.
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} className={className} src={src} />;
}
