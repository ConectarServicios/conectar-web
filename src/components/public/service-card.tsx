import type { Service } from "@/types/services";

export function ServiceCard({ service, index }: Readonly<{ service: Service; index: number }>) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
      <div className={`absolute inset-x-0 top-0 h-1 ${service.featured ? "bg-orange-500" : "bg-blue-700"}`} />
      <div className="flex items-start justify-between gap-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#0b2440] text-lg font-black text-white" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        {service.featured && <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-800">Destacado</span>}
      </div>
      {service.category && <p className="mt-7 text-xs font-bold tracking-widest text-blue-700 uppercase">{service.category}</p>}
      <h3 className={`${service.category ? "mt-2" : "mt-7"} text-2xl font-black tracking-tight text-slate-950`}>{service.name}</h3>
      {service.short_description && <p className="mt-4 leading-7 text-slate-600">{service.short_description}</p>}
    </article>
  );
}
