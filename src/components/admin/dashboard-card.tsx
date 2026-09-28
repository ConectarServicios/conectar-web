import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function DashboardCard({ title, href, icon: Icon }: Readonly<{ title: string; href: string; icon: LucideIcon }>) {
  return (
    <Link className="group flex min-h-20 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500" href={href}>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-700 transition group-hover:bg-orange-100"><Icon aria-hidden="true" className="size-5" /></span>
      <h2 className="min-w-0 flex-1 text-sm font-bold leading-5 text-slate-950 sm:text-base">{title}</h2>
      <span aria-hidden="true" className="text-lg text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-orange-700">→</span>
    </Link>
  );
}
