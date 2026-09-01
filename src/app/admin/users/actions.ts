"use server";

import { revalidatePath } from "next/cache";

import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUuid, parseUserForm } from "@/lib/validations/admin-users";
import type { AdminUserActionState } from "@/types/admin-users";

const forbiddenMessage = "No tenés permiso para administrar usuarios.";
const lastSuperAdminMessage =
  "La operación dejaría al sistema sin un super administrador activo.";

function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL no contiene una URL válida.");
  }
}

export async function inviteAdminUser(
  _state: AdminUserActionState,
  formData: FormData,
): Promise<AdminUserActionState> {
  const parsed = parseUserForm(formData, true);
  if (!parsed.data)
    return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };

  const authorization = await requireSuperAdmin();
  if (!authorization) return { message: forbiddenMessage };

  let admin;
  try {
    admin = createAdminClient();
  } catch (error) {
    console.error("Unable to initialize privileged Auth client", error);
    return { message: "El servicio de invitaciones no está configurado." };
  }

  const { data, error: invitationError } =
    await admin.auth.admin.inviteUserByEmail(parsed.data.email, {
      redirectTo: `${siteUrl()}/auth/set-password`,
    });

  if (invitationError || !data.user) {
    console.error("Unable to invite administrative user", invitationError);
    const duplicate =
      invitationError?.status === 422 ||
      invitationError?.message.toLowerCase().includes("already");
    return {
      message: duplicate
        ? "Ya existe una cuenta con ese email."
        : "No se pudo enviar la invitación. Intentá nuevamente.",
      fieldErrors: duplicate ? { email: "Este email ya está registrado." } : undefined,
    };
  }

  const { error: profileError } = await authorization.supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      full_name: parsed.data.fullName,
      role: parsed.data.role,
      active: true,
    });

  if (profileError) {
    console.error("Unable to create invited user's profile", profileError);
    const { error: compensationError } = await admin.auth.admin.deleteUser(data.user.id);
    if (compensationError)
      console.error("Unable to compensate orphaned invited Auth user", compensationError);
    return {
      message: compensationError
        ? "No se pudo crear el perfil. Contactá a soporte para revisar la cuenta."
        : "No se pudo crear el perfil y la invitación fue revertida.",
    };
  }

  revalidatePath("/admin/users");
  return { success: true, message: "Invitación enviada correctamente." };
}

export async function updateAdminUser(
  id: string,
  _state: AdminUserActionState,
  formData: FormData,
): Promise<AdminUserActionState> {
  if (!isUuid(id)) return { message: "El identificador del usuario no es válido." };
  const parsed = parseUserForm(formData, false);
  if (!parsed.data)
    return { message: "Revisá los campos marcados.", fieldErrors: parsed.errors };
  const activeValue = formData.get("active");
  if (activeValue !== "true" && activeValue !== "false")
    return { message: "El estado seleccionado no es válido.", fieldErrors: { active: "Seleccioná un estado válido." } };
  const active = activeValue === "true";

  const authorization = await requireSuperAdmin();
  if (!authorization) return { message: forbiddenMessage };
  const { data: target, error: targetError } = await authorization.supabase
    .from("profiles")
    .select("id, role, active")
    .eq("id", id)
    .maybeSingle();
  if (targetError || !target) {
    if (targetError) console.error("Unable to read profile before update", targetError);
    return { message: "No se encontró el perfil administrativo." };
  }

  const removesActiveSuperAdmin =
    target.role === "super_admin" && target.active &&
    (!active || parsed.data.role !== "super_admin");
  if (id === authorization.user.id && removesActiveSuperAdmin)
    return { message: "No podés desactivar ni degradar tu propia cuenta de super administrador." };
  if (removesActiveSuperAdmin) {
    const { count, error } = await authorization.supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "super_admin")
      .eq("active", true);
    if (error) {
      console.error("Unable to verify active super administrators", error);
      return { message: "No se pudo verificar la protección de accesos." };
    }
    if ((count ?? 0) <= 1) return { message: lastSuperAdminMessage };
  }

  const { error } = await authorization.supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName, role: parsed.data.role, active })
    .eq("id", id);
  if (error) {
    console.error("Unable to update administrative profile", error);
    return {
      message: error.message.includes("last active super_admin")
        ? lastSuperAdminMessage
        : "No se pudieron guardar los cambios.",
    };
  }
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}/edit`);
  return { success: true, message: "Cambios guardados correctamente." };
}

export async function setAdminUserActive(id: string, active: boolean) {
  if (!isUuid(id) || typeof active !== "boolean") return;
  const authorization = await requireSuperAdmin();
  if (!authorization) return;
  if (id === authorization.user.id && !active) return;

  const { data: target } = await authorization.supabase
    .from("profiles")
    .select("full_name, role, active")
    .eq("id", id)
    .maybeSingle();
  if (!target) return;
  if (!active && target.active && target.role === "super_admin") {
    const { count, error } = await authorization.supabase
      .from("profiles").select("id", { count: "exact", head: true })
      .eq("role", "super_admin").eq("active", true);
    if (error || (count ?? 0) <= 1) return;
  }
  const { error } = await authorization.supabase
    .from("profiles").update({ active }).eq("id", id);
  if (error) console.error("Unable to change administrative access", error);
  revalidatePath("/admin/users");
}
