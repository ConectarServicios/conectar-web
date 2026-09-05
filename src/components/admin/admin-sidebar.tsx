import { AdminNav } from "@/components/admin/admin-nav";
import type { AdminRole } from "@/types/admin";

type AdminSidebarProps = Readonly<{
  expanded: boolean | null;
  onToggle: () => void;
  role: AdminRole;
}>;

function SidebarToggle({
  expanded,
  onToggle,
  className = "",
}: Readonly<{
  expanded: boolean;
  onToggle: () => void;
  className?: string;
}>) {
  return (
    <button
      aria-controls="admin-desktop-navigation"
      aria-expanded={expanded}
      aria-label={expanded ? "Contraer menú" : "Expandir menú"}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-700 text-xl leading-none text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${className}`}
      onClick={onToggle}
      type="button"
    >
      <span aria-hidden="true">{expanded ? "‹" : "›"}</span>
    </button>
  );
}

export function AdminSidebar({ expanded, onToggle, role }: AdminSidebarProps) {
  const sidebarWidth =
    expanded === null
      ? "w-16 min-[1440px]:w-72"
      : expanded
        ? "w-72"
        : "w-16";
  const expandedContent =
    expanded === null
      ? "hidden min-[1440px]:block"
      : expanded
        ? "block"
        : "hidden";
  const collapsedIdentity =
    expanded === null
      ? "block min-[1440px]:hidden"
      : expanded
        ? "hidden"
        : "block";
  const headerLayout =
    expanded === null
      ? "flex-col gap-1 min-[1440px]:flex-row min-[1440px]:justify-between"
      : expanded
        ? "flex-row justify-between gap-3"
        : "flex-col gap-1";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden border-r border-slate-800 bg-slate-950 transition-[width] duration-200 lg:block ${sidebarWidth}`}
    >
      <div className={`flex h-20 items-center justify-center border-b border-slate-800 px-3 ${headerLayout}`}>
        <div className={expandedContent}>
          <p className="text-lg font-bold tracking-tight text-white">Conectar</p>
          <p className="text-xs font-medium tracking-[0.16em] text-orange-400 uppercase">Servicios · Admin</p>
        </div>
        <p aria-hidden="true" className={`text-lg font-bold text-white ${collapsedIdentity}`}>
          C
        </p>
        {expanded === null ? (
          <>
            <SidebarToggle className="min-[1440px]:hidden" expanded={false} onToggle={onToggle} />
            <SidebarToggle className="hidden min-[1440px]:grid" expanded onToggle={onToggle} />
          </>
        ) : (
          <SidebarToggle expanded={expanded} onToggle={onToggle} />
        )}
      </div>
      <div
        className={`h-[calc(100vh-5rem)] overflow-y-auto px-4 py-6 ${expandedContent}`}
        id="admin-desktop-navigation"
      >
        <AdminNav role={role} />
      </div>
    </aside>
  );
}
