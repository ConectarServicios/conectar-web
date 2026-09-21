export type PublicNavigationItem = Readonly<{
  href: string;
  label: string;
  activePrefixes?: readonly string[];
  children?: readonly PublicNavigationItem[];
}>;

export const publicNavigation: readonly PublicNavigationItem[] = [
  { href: "/servicios", label: "Servicios", activePrefixes: ["/servicios"] },
  {
    href: "/noticias",
    label: "Actualidad",
    activePrefixes: ["/noticias", "/eventos"],
    children: [
      { href: "/noticias", label: "Noticias" },
      { href: "/eventos", label: "Eventos" },
    ],
  },
  {
    href: "/quienes-somos",
    label: "Quiénes somos",
    activePrefixes: ["/quienes-somos"],
  },
] as const;

export function isNavigationItemActive(
  pathname: string,
  item: PublicNavigationItem,
): boolean {
  return (item.activePrefixes ?? []).some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function getContactHref(pathname: string): "/hogar#contacto" | "/corporativo#contacto" {
  return pathname === "/corporativo" || pathname.startsWith("/corporativo/")
    ? "/corporativo#contacto"
    : "/hogar#contacto";
}
