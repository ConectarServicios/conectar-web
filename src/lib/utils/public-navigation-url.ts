const LEGACY_PUBLIC_DESTINATIONS: Readonly<Record<string, string>> = {
  "/": "/hogar",
  "/#inicio": "/hogar#inicio",
  "/#planes": "/hogar#planes",
  "/#contacto": "/hogar#contacto",
  "#contacto": "/hogar#contacto",
};

/** Resolve administrable legacy destinations against their canonical public page. */
export function normalizePublicNavigationUrl(value: string): string {
  const normalized = LEGACY_PUBLIC_DESTINATIONS[value.trim()] ?? value.trim();
  if (normalized.startsWith("/") || normalized.startsWith("#")) return normalized;

  try {
    const url = new URL(normalized);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "#";
  } catch {
    return "#";
  }
}

export function isExternalPublicUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
