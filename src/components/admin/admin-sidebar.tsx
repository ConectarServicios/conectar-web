import { AdminNav } from "@/components/admin/admin-nav";
import type { AdminRole } from "@/types/admin";

export function AdminSidebar({ role }: Readonly<{ role: AdminRole }>) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-800 bg-slate-950 lg:block">
      <div className="flex h-20 items-center border-b border-slate-800 px-6">
        <div>
          <p className="text-lg font-bold tracking-tight text-white">Conectar</p>
          <p className="text-xs font-medium tracking-[0.16em] text-orange-400 uppercase">Servicios · Admin</p>
        </div>
      </div>
      <div className="h-[calc(100vh-5rem)] overflow-y-auto px-4 py-6">
        <AdminNav role={role} />
      </div>
    </aside>
  );
}
