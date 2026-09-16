import { ArrowUpRight, type LucideIcon } from "lucide-react";

type CorporateServiceCardProps = {
  description: string;
  icon: LucideIcon;
  title: string;
  tone?: "white" | "slate";
};

export function CorporateServiceCard({
  description,
  icon: Icon,
  title,
  tone = "white",
}: CorporateServiceCardProps) {
  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border border-slate-200 p-6 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-[#2f6bff]/30 hover:shadow-lg hover:shadow-slate-950/10 sm:p-7 ${
        tone === "slate" ? "bg-white" : "bg-slate-50/60"
      }`}
    >
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-xl bg-[#e9efff] text-[#2456d6] transition-colors group-hover:bg-[#2f6bff] group-hover:text-white"
      >
        <Icon size={23} strokeWidth={2} />
      </span>
      <h3 className="font-display mt-5 text-xl font-bold tracking-[-0.025em] text-[#0b2038]">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
        {description}
      </p>
      <a
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-sm text-sm font-bold text-[#2456d6] outline-none transition-colors hover:text-[#173b99] focus-visible:ring-2 focus-visible:ring-[#2f6bff] focus-visible:ring-offset-4"
        href="#contacto"
      >
        Conocer más
        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.5} />
      </a>
    </article>
  );
}
