"use client";

import Link from "next/link";
import { useActionState } from "react";

import { inviteAdminUser, updateAdminUser } from "@/app/admin/users/actions";
import { ADMIN_ROLES, ADMIN_ROLE_LABELS } from "@/types/admin";
import type { AdminUser, AdminUserActionState } from "@/types/admin-users";

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-slate-100";
const roleHelp = {
  editor: "Puede administrar contenido editorial.",
  admin: "Puede administrar contenido y configuración.",
  super_admin: "Puede administrar contenido, configuración y usuarios.",
};

type Props = Readonly<
  | { mode: "create"; user?: never; currentUserId?: never }
  | { mode: "edit"; user: AdminUser; currentUserId: string }
>;

type FieldName = "full_name" | "email" | "role" | "active";

export function AdminUserForm(props: Props) {
  const action =
    props.mode === "create"
      ? inviteAdminUser
      : updateAdminUser.bind(null, props.user.id);
  const [state, formAction, pending] = useActionState(
    action,
    {} as AdminUserActionState,
  );
  const fieldError = (field: FieldName) => state.fieldErrors?.[field];
  const editingSelf =
    props.mode === "edit" &&
    props.user.id === props.currentUserId &&
    props.user.role === "super_admin";

  return (
    <form action={formAction} className="space-y-6">
      {state.message ? (
        <p
          aria-live="polite"
          className={`rounded-xl border p-4 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role={state.success ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-2 text-lg font-bold">Datos del usuario</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Nombre completo *
            <input
              className={inputClass}
              defaultValue={props.mode === "edit" ? props.user.fullName : undefined}
              maxLength={100}
              minLength={2}
              name="full_name"
              required
            />
            <FieldError message={fieldError("full_name")} />
          </label>

          <label className="text-sm font-semibold">
            Email {props.mode === "create" ? "*" : null}
            <input
              autoComplete="email"
              className={inputClass}
              defaultValue={props.mode === "edit" ? props.user.email : undefined}
              disabled={props.mode === "edit"}
              name="email"
              required={props.mode === "create"}
              type="email"
            />
            <FieldError message={fieldError("email")} />
            {props.mode === "edit" ? (
              <span className="mt-1 block text-xs font-normal text-slate-500">
                El email no se puede modificar desde este módulo.
              </span>
            ) : null}
          </label>

          <label className="text-sm font-semibold">
            Rol *
            <select
              className={inputClass}
              defaultValue={props.mode === "edit" ? props.user.role : "editor"}
              name="role"
              required
            >
              {ADMIN_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ADMIN_ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            <FieldError message={fieldError("role")} />
          </label>

          {props.mode === "edit" ? (
            <label className="text-sm font-semibold">
              Estado *
              <select
                className={inputClass}
                defaultValue={String(props.user.active)}
                name="active"
                required
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
              <FieldError message={fieldError("active")} />
            </label>
          ) : null}
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-bold text-slate-800">Alcance de los roles</p>
          <ul className="mt-2 space-y-1">
            {ADMIN_ROLES.slice()
              .reverse()
              .map((role) => (
                <li key={role}>
                  <strong>{ADMIN_ROLE_LABELS[role]}:</strong> {roleHelp[role]}
                </li>
              ))}
          </ul>
        </div>

        {editingSelf ? (
          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm font-medium text-amber-900">
            No podés desactivar ni degradar tu propia cuenta de super
            administrador.
          </p>
        ) : null}
      </fieldset>

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-bold"
          href="/admin/users"
        >
          Cancelar
        </Link>
        <button
          className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white disabled:opacity-60"
          disabled={pending}
        >
          {pending
            ? "Procesando…"
            : props.mode === "create"
              ? "Enviar invitación"
              : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

function FieldError({ message }: Readonly<{ message?: string }>) {
  return message ? (
    <span className="mt-1 block text-xs text-red-700">{message}</span>
  ) : null;
}
