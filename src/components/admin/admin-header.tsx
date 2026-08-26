import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { ADMIN_ROLE_LABELS, type AdminRole } from "@/types/admin";

type AdminHeaderProps = Readonly<{ fullName: string | null; email: string; role: AdminRole }>;

export function AdminHeader({ fullName, email, role }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <AdminMobileNav role={role} />
          <div className="min-w-0">
            {fullName ? <p className="truncate text-sm font-semibold text-slate-950">{fullName}</p> : null}
            <p className="truncate text-xs text-slate-500">{email}</p>
            <p className="mt-0.5 text-[0.68rem] font-bold tracking-wide text-orange-700 uppercase">{ADMIN_ROLE_LABELS[role]}</p>
          </div>
        </div>
        <LogoutButton variant="light" />
      </div>
    </header>
  );
}
