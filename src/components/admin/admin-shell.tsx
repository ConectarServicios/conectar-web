import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { AdminRole } from "@/types/admin";

type AdminShellProps = Readonly<{
  children: ReactNode;
  role: AdminRole;
}>;

export function AdminShell({ children, role }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex lg:items-start">
      <AdminSidebar role={role} />
      <div className="min-h-screen min-w-0 flex-1">{children}</div>
    </div>
  );
}
