const LEGACY_PUBLIC_DESTINATIONS: Readonly<Record<string, string>> = {
  "/": "/hogar",
  "/#inicio": "/hogar#inicio",
  "/#planes": "/hogar#planes",
  "/#contacto": "/hogar#contacto",
  "#contacto": "/hogar#contacto",
};

/** Resolve administrable legacy destinations against their canonical public page. */
export function normalizePublicNavigationUrl(value: string): string {
  return LEGACY_PUBLIC_DESTINATIONS[value] ?? value;
}
