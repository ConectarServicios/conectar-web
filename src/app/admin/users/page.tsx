import Link from "next/link";
import { redirect } from "next/navigation";

import { setAdminUserActive } from "@/app/admin/users/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AccessToggleButton } from "@/components/admin/users/access-toggle-button";
import { getAdminUsers } from "@/lib/supabase/admin-users";
import { ADMIN_ROLE_LABELS } from "@/types/admin";
import type { AdminUser } from "@/types/admin-users";

export default async function UsersPage() {
  const result = await getAdminUsers();
  if (!result) redirect("/auth/unauthorized");

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          description="Gestioná los perfiles y accesos del equipo administrativo."
          title="Usuarios"
        />
        <Link className="shrink-0 rounded-xl bg-orange-600 px-5 py-3 text-center font-bold text-white hover:bg-orange-700" href="/admin/users/new">
          Nuevo usuario
        </Link>
      </div>
      {result.users.length ? (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs tracking-wide text-slate-600 uppercase"><tr>
                {['Nombre','Email','Rol','Estado','Fecha de alta','Acciones'].map((item) => <th className="px-5 py-4 font-bold" key={item}>{item}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-slate-200">
                {result.users.map((user) => <UserRow currentUserId={result.currentUserId} key={user.id} user={user} />)}
              </tbody>
            </table>
          </div>
          <div className="grid gap-4 lg:hidden">
            {result.users.map((user) => <UserCard currentUserId={result.currentUserId} key={user.id} user={user} />)}
          </div>
        </>
      ) : <p className="rounded-2xl border bg-white p-8 text-slate-600">No hay perfiles administrativos.</p>}
    </>
  );
}

function UserRow({ user, currentUserId }: Readonly<{ user: AdminUser; currentUserId: string }>) {
  return <tr>
    <td className="px-5 py-4 font-bold text-slate-950">{user.fullName}{user.id === currentUserId && <span className="ml-2 text-xs font-normal text-slate-500">(vos)</span>}</td>
    <td className="px-5 py-4 text-slate-600">{user.email}</td>
    <td className="px-5 py-4"><RoleBadge role={user.role} /></td>
    <td className="px-5 py-4"><StatusBadge active={user.active} /></td>
    <td className="px-5 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
    <td className="px-5 py-4"><UserActions currentUserId={currentUserId} user={user} /></td>
  </tr>;
}

function UserCard({ user, currentUserId }: Readonly<{ user: AdminUser; currentUserId: string }>) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-bold text-slate-950">{user.fullName}</h2><p className="mt-1 break-all text-sm text-slate-600">{user.email}</p></div><StatusBadge active={user.active} /></div>
    <dl className="mt-5 grid gap-4 sm:grid-cols-2"><div><dt className="text-xs font-bold text-slate-500 uppercase">Rol</dt><dd className="mt-1"><RoleBadge role={user.role} /></dd></div><div><dt className="text-xs font-bold text-slate-500 uppercase">Fecha de alta</dt><dd className="mt-1 text-sm">{formatDate(user.createdAt)}</dd></div></dl>
    <div className="mt-5 border-t pt-4"><UserActions currentUserId={currentUserId} user={user} /></div>
  </article>;
}

function UserActions({ user, currentUserId }: Readonly<{ user: AdminUser; currentUserId: string }>) {
  const action = setAdminUserActive.bind(null, user.id, !user.active);
  return <div className="flex flex-wrap items-center gap-4"><Link className="font-bold text-orange-700 hover:text-orange-900" href={`/admin/users/${user.id}/edit`}>Editar</Link><form action={action}><AccessToggleButton active={user.active} disabled={user.id === currentUserId && user.active} name={user.fullName} /></form></div>;
}

function RoleBadge({ role }: Readonly<{ role: AdminUser['role'] }>) { return <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800 uppercase">{ADMIN_ROLE_LABELS[role]}</span>; }
function StatusBadge({ active }: Readonly<{ active: boolean }>) { return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{active ? 'Activo' : 'Inactivo'}</span>; }
function formatDate(value: string) { return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value)); }
