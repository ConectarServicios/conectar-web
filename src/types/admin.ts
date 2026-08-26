export const ADMIN_ROLES = ["super_admin", "admin", "editor"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super administrador",
  admin: "Administrador",
  editor: "Editor",
};

export function isAdminRole(role: unknown): role is AdminRole {
  return typeof role === "string" && ADMIN_ROLES.some((value) => value === role);
}
