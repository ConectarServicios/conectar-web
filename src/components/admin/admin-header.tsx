import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { ADMIN_ROLE_LABELS, type AdminRole } from "@/types/admin";

type AdminHeaderProps = Readonly<{ fullName: string | null; email: string; role: AdminRole }>;

export function AdminHeader({ fullName, email, role }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <AdminMobileNav role={role} />
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-950">{fullName || email}</p>
              <span className="hidden shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-[0.65rem] font-bold text-orange-800 uppercase sm:inline">{ADMIN_ROLE_LABELS[role]}</span>
            </div>
            {fullName ? <p className="max-w-40 truncate text-xs text-slate-500 min-[390px]:max-w-52 sm:max-w-sm">{email}</p> : null}
          </div>
        </div>
        <LogoutButton variant="light" />
      </div>
    </header>
  );
}
