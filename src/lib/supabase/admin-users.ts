import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { isAdminRole, type AdminRole } from "@/types/admin";
import type { AdminUser } from "@/types/admin-users";

export async function getAdminUsers(): Promise<{
  currentUserId: string;
  users: AdminUser[];
} | null> {
  const authorization = await requireSuperAdmin();
  if (!authorization) return null;

  const { data: profiles, error: profilesError } = await authorization.supabase
    .from("profiles")
    .select("id, full_name, role, active, created_at");
  if (profilesError) {
    console.error("Unable to list administrative profiles", profilesError);
    throw new Error("No se pudieron obtener los perfiles administrativos.");
  }

  const admin = createAdminClient();
  const authUsers = new Map<string, { email?: string; created_at: string }>();
  let page = 1;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) {
      console.error("Unable to list Auth users", error);
      throw new Error("No se pudieron obtener las cuentas de acceso.");
    }
    data.users.forEach(({ id, email, created_at }) =>
      authUsers.set(id, { email, created_at }),
    );
    if (data.users.length < 1000) break;
    page += 1;
  }

  const roleOrder = { super_admin: 0, admin: 1, editor: 2 } as const;
  const users = profiles
    .filter((profile) => isAdminRole(profile.role))
    .map((profile): AdminUser => {
      const authUser = authUsers.get(profile.id);
      const role = profile.role as AdminRole;
      return {
        id: profile.id,
        fullName: profile.full_name,
        email: authUser?.email ?? "Email no disponible",
        role,
        active: profile.active,
        createdAt: authUser?.created_at ?? profile.created_at,
      };
    })
    .sort(
      (a, b) =>
        Number(b.active) - Number(a.active) ||
        roleOrder[a.role] - roleOrder[b.role] ||
        a.fullName.localeCompare(b.fullName, "es", { sensitivity: "base" }) ||
        a.email.localeCompare(b.email),
    );

  return { currentUserId: authorization.user.id, users };
}

export async function getAdminUser(id: string) {
  const result = await getAdminUsers();
  return result
    ? { currentUserId: result.currentUserId, user: result.users.find((item) => item.id === id) }
    : null;
}
