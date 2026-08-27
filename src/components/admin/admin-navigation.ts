import type { AdminRole } from "@/types/admin";

export type AdminNavigationSection = "Principal" | "Contenido" | "Configuración" | "Administración";

export type AdminNavigationItem = Readonly<{
  label: string;
  href: string;
  section: AdminNavigationSection;
  roles: readonly AdminRole[];
}>;

const CONTENT_ROLES = ["editor", "admin", "super_admin"] as const satisfies readonly AdminRole[];
const CONFIGURATION_ROLES = ["admin", "super_admin"] as const satisfies readonly AdminRole[];

export const ADMIN_NAVIGATION: readonly AdminNavigationItem[] = [
  { label: "Dashboard", href: "/admin", section: "Principal", roles: CONTENT_ROLES },
  { label: "Planes", href: "/admin/plans", section: "Contenido", roles: CONTENT_ROLES },
  { label: "Servicios", href: "/admin/services", section: "Contenido", roles: CONTENT_ROLES },
  { label: "Conectar Play", href: "/admin/conectar-play", section: "Contenido", roles: CONTENT_ROLES },
  { label: "Noticias", href: "/admin/news", section: "Contenido", roles: CONTENT_ROLES },
  { label: "Eventos", href: "/admin/events", section: "Contenido", roles: CONTENT_ROLES },
  { label: "Promociones", href: "/admin/promotions", section: "Contenido", roles: CONTENT_ROLES },
  { label: "Preguntas frecuentes", href: "/admin/faqs", section: "Contenido", roles: CONTENT_ROLES },
  { label: "Datos de contacto", href: "/admin/contact", section: "Configuración", roles: CONFIGURATION_ROLES },
  { label: "Redes sociales", href: "/admin/social", section: "Configuración", roles: CONFIGURATION_ROLES },
  { label: "Configuración del sitio", href: "/admin/settings", section: "Configuración", roles: CONFIGURATION_ROLES },
  { label: "Usuarios", href: "/admin/users", section: "Administración", roles: ["super_admin"] },
];

export const ADMIN_NAVIGATION_SECTIONS: readonly AdminNavigationSection[] = [
  "Principal",
  "Contenido",
  "Configuración",
  "Administración",
];

export function getNavigationForRole(role: AdminRole) {
  return ADMIN_NAVIGATION.filter((item) => item.roles.includes(role));
}
