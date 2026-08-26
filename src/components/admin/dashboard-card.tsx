import Link from "next/link";

export function DashboardCard({ title, description, href }: Readonly<{ title: string; description: string; href: string }>) {
  return (
    <Link className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500" href={href}>
      <div className="mb-5 h-1 w-10 rounded-full bg-orange-500 transition-all group-hover:w-16" />
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <p className="mt-5 text-sm font-semibold text-blue-800">Gestionar <span aria-hidden="true">→</span></p>
    </Link>
  );
}
