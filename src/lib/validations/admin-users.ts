import { isAdminRole, type AdminRole } from "@/types/admin";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UserFields = "full_name" | "email" | "role" | "active" | "id";
export type UserFieldErrors = Partial<Record<UserFields, string>>;

export function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

export function parseUserForm(formData: FormData, includeEmail: boolean) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const roleValue = formData.get("role");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const errors: UserFieldErrors = {};

  if (fullName.length < 2 || fullName.length > 100)
    errors.full_name = "Ingresá entre 2 y 100 caracteres.";
  if (!isAdminRole(roleValue)) errors.role = "Seleccioná un rol válido.";
  if (includeEmail && (email.length > 254 || !EMAIL_PATTERN.test(email)))
    errors.email = "Ingresá un email válido.";

  if (Object.keys(errors).length || !isAdminRole(roleValue))
    return { data: null, errors };

  return {
    data: { fullName, role: roleValue as AdminRole, email },
    errors,
  };
}
