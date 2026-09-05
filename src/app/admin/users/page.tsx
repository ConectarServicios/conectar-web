import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UserActionsMenu } from "@/components/admin/users/user-actions-menu";
import { getAdminUsers } from "@/lib/supabase/admin-users";
import { ADMIN_ROLE_LABELS } from "@/types/admin";
import type { AdminUser } from "@/types/admin-users";

const tableHeadings = [
  "Nombre",
  "Email",
  "Rol",
  "Estado",
  "Fecha de alta",
  "Acciones",
];

export default async function UsersPage() {
  const result = await getAdminUsers();
  if (!result) redirect("/auth/unauthorized");

  return (
    <div className="@container">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          description="Gestioná los perfiles y accesos del equipo administrativo."
          title="Usuarios"
        />
        <Link
          className="shrink-0 rounded-xl bg-orange-600 px-5 py-3 text-center font-bold text-white hover:bg-orange-700"
          href="/admin/users/new"
        >
          Nuevo usuario
        </Link>
      </div>

      {result.users.length ? (
        <>
          <div className="hidden rounded-2xl border border-slate-200 bg-white shadow-sm @[1120px]:block">
            <table className="w-full table-fixed text-left text-sm">
              <colgroup>
                <col className="w-[20%]" />
                <col />
                <col className="w-36" />
                <col className="w-28" />
                <col className="w-40" />
                <col className="w-44" />
              </colgroup>
              <thead className="bg-slate-100 text-xs tracking-wide text-slate-600 uppercase">
                <tr>
                  {tableHeadings.map((heading) => (
                    <th className="px-5 py-4 font-bold" key={heading}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {result.users.map((user) => (
                  <UserRow
                    currentUserId={result.currentUserId}
                    key={user.id}
                    user={user}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-4 @[1120px]:hidden">
            {result.users.map((user) => (
              <UserCard
                currentUserId={result.currentUserId}
                key={user.id}
                user={user}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="rounded-2xl border bg-white p-8 text-slate-600">
          No hay perfiles administrativos.
        </p>
      )}
    </div>
  );
}

function UserRow({
  user,
  currentUserId,
}: Readonly<{ user: AdminUser; currentUserId: string }>) {
  return (
    <tr>
      <td className="px-5 py-4 font-bold text-slate-950">
        {user.fullName}
        {user.id === currentUserId ? (
          <span className="ml-2 text-xs font-normal text-slate-500">(vos)</span>
        ) : null}
      </td>
      <td className="break-words px-5 py-4 text-slate-600">{user.email}</td>
      <td className="px-5 py-4">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-5 py-4">
        <StatusBadge active={user.active} />
      </td>
      <td className="px-5 py-4 text-slate-600">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-5 py-4">
        <UserActions currentUserId={currentUserId} user={user} />
      </td>
    </tr>
  );
}

function UserCard({
  user,
  currentUserId,
}: Readonly<{ user: AdminUser; currentUserId: string }>) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-slate-950">{user.fullName}</h2>
          <p className="mt-1 break-all text-sm text-slate-600">{user.email}</p>
        </div>
        <StatusBadge active={user.active} />
      </div>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-bold text-slate-500 uppercase">Rol</dt>
          <dd className="mt-1">
            <RoleBadge role={user.role} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold text-slate-500 uppercase">
            Fecha de alta
          </dt>
          <dd className="mt-1 text-sm">{formatDate(user.createdAt)}</dd>
        </div>
      </dl>
      <div className="mt-5 border-t pt-4">
        <UserActions currentUserId={currentUserId} user={user} />
      </div>
    </article>
  );
}

function UserActions({
  user,
  currentUserId,
}: Readonly<{ user: AdminUser; currentUserId: string }>) {
  return (
    <div className="flex w-max max-w-full items-center gap-2 text-sm whitespace-nowrap">
      <Link
        className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 font-bold text-orange-800 hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-orange-500"
        href={`/admin/users/${user.id}/edit`}
      >
        Editar
      </Link>
      <UserActionsMenu
        active={user.active}
        disabled={user.id === currentUserId && user.active}
        id={user.id}
        name={user.fullName}
      />
    </div>
  );
}

function RoleBadge({ role }: Readonly<{ role: AdminUser["role"] }>) {
  return (
    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800 uppercase">
      {ADMIN_ROLE_LABELS[role]}
    </span>
  );
}

function StatusBadge({ active }: Readonly<{ active: boolean }>) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        active ? "bg-emerald-50 text-emerald-800" : "bg-slate-200 text-slate-700"
      }`}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}
