import type { LucideIcon } from "lucide-react";

type HeroBenefit = Readonly<{
  title: string;
  detail: string;
  icon: LucideIcon;
}>;

export function HeroBenefits({ items }: Readonly<{ items: readonly HeroBenefit[] }>) {
  return (
    <aside
      className="border-y border-[#315C88]/40 bg-[#0a2238] py-4 text-white sm:py-5"
      aria-label="Razones para elegir Conectar Servicios"
    >
      <ul className="public-container grid auto-rows-fr list-none grid-cols-1 gap-3 min-[440px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {items.map(({ title, detail, icon: Icon }) => (
          <li
            className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#315C88]/70 bg-[#102d49] p-4 shadow-sm transition-colors duration-150 hover:border-[#6E95BC] hover:bg-[#153754] motion-reduce:transition-none sm:p-5"
            key={title}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#6E95BC]/35 bg-[#183A62] text-[#B9D5EF]" aria-hidden="true">
              <Icon className="size-6" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <strong className="font-display block text-sm leading-5 font-bold text-white sm:text-[0.9375rem]">
                {title}
              </strong>
              <span className="mt-1 block text-xs leading-5 text-[#b8cbdb]">
                {detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
