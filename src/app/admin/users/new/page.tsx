import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminUserForm } from "@/components/admin/users/admin-user-form";
import { requireSuperAdmin } from "@/lib/auth/require-super-admin";

export default async function NewAdminUserPage() {
  if (!(await requireSuperAdmin())) redirect("/auth/unauthorized");
  return <><AdminPageHeader description="Creá la cuenta mediante una invitación segura por email." title="Nuevo usuario" /><AdminUserForm mode="create" /></>;
}
