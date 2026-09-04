import Link from "next/link";
import { ServiceAreaIcon } from "@/components/public/service-area-icon";
import { serviceAreaHref } from "@/lib/supabase/services";
import type { ServiceArea } from "@/types/services";
export function ServiceAreaCard({ area }: Readonly<{ area: ServiceArea }>) {
  return <article className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8"><div className="flex items-start justify-between"><ServiceAreaIcon icon={area.icon} />{area.featured && <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-800">Destacada</span>}</div><h3 className="mt-7 text-2xl font-black tracking-tight text-slate-950">{area.name}</h3>{area.short_description && <p className="mt-4 flex-1 leading-7 text-slate-600">{area.short_description}</p>}<Link className="mt-7 w-fit font-bold text-orange-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-orange-600" href={serviceAreaHref(area)}>Conocer más <span aria-hidden="true">→</span></Link></article>;
}
