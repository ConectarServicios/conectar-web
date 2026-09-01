import { notFound, redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminUserForm } from "@/components/admin/users/admin-user-form";
import { getAdminUser } from "@/lib/supabase/admin-users";
import { isUuid } from "@/lib/validations/admin-users";

export default async function EditAdminUserPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const result = await getAdminUser(id);
  if (!result) redirect("/auth/unauthorized");
  if (!result.user) notFound();
  return <><AdminPageHeader description="Actualizá el perfil y el acceso administrativo." title="Editar usuario" /><AdminUserForm currentUserId={result.currentUserId} mode="edit" user={result.user} /></>;
}
