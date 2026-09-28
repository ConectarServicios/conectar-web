import type { AdminRole } from "@/types/admin";
import {
  CalendarDays,
  CircleHelp,
  Contact,
  Gauge,
  Megaphone,
  Newspaper,
  PlaySquare,
  Settings,
  Share2,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export type AdminNavigationSection = "Principal" | "Contenido" | "Configuración" | "Administración";

export type AdminNavigationItem = Readonly<{
  label: string;
  href: string;
  section: AdminNavigationSection;
  roles: readonly AdminRole[];
  icon: LucideIcon;
}>;

const CONTENT_ROLES = ["editor", "admin", "super_admin"] as const satisfies readonly AdminRole[];
const CONFIGURATION_ROLES = ["admin", "super_admin"] as const satisfies readonly AdminRole[];

export const ADMIN_NAVIGATION: readonly AdminNavigationItem[] = [
  { label: "Dashboard", href: "/admin", section: "Principal", roles: CONTENT_ROLES, icon: Gauge },
  { label: "Planes", href: "/admin/plans", section: "Contenido", roles: CONTENT_ROLES, icon: Wifi },
  { label: "Conectar Play", href: "/admin/conectar-play", section: "Contenido", roles: CONTENT_ROLES, icon: PlaySquare },
  { label: "Noticias / Comunicados", href: "/admin/news", section: "Contenido", roles: CONTENT_ROLES, icon: Newspaper },
  { label: "Eventos", href: "/admin/events", section: "Contenido", roles: CONTENT_ROLES, icon: CalendarDays },
  { label: "Promociones", href: "/admin/promotions", section: "Contenido", roles: CONTENT_ROLES, icon: Megaphone },
  { label: "Preguntas frecuentes", href: "/admin/faqs", section: "Contenido", roles: CONTENT_ROLES, icon: CircleHelp },
  { label: "Datos de contacto", href: "/admin/contact", section: "Configuración", roles: CONFIGURATION_ROLES, icon: Contact },
  { label: "Redes sociales", href: "/admin/social", section: "Configuración", roles: CONFIGURATION_ROLES, icon: Share2 },
  { label: "Configuración del sitio", href: "/admin/settings", section: "Configuración", roles: CONFIGURATION_ROLES, icon: Settings },
  { label: "Usuarios", href: "/admin/users", section: "Administración", roles: ["super_admin"], icon: Users },
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
