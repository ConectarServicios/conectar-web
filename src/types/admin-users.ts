import type { AdminRole } from "@/types/admin";
import type { UserFieldErrors } from "@/lib/validations/admin-users";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
};

export type AdminUserActionState = {
  success?: boolean;
  message?: string;
  fieldErrors?: UserFieldErrors;
};
