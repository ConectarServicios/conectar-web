import { PublicMobileNav } from "@/components/public/public-mobile-nav";

const navigation = [
  { href: "#inicio", label: "Inicio" },
  { href: "#planes", label: "Planes" },
  { href: "#servicios", label: "Servicios" },
  { href: "#contacto", label: "Contacto" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071a2f]/95 text-white shadow-lg shadow-slate-950/10 backdrop-blur">
      <div className="public-container flex h-18 items-center justify-between gap-6">
        <a
          className="group flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
          href="#inicio"
          aria-label="Conectar Servicios, ir al inicio"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-orange-500 text-lg font-black shadow-lg shadow-orange-950/30" aria-hidden="true">
            C
          </span>
          <span className="text-base font-bold tracking-tight sm:text-lg">
            Conectar <span className="font-normal text-slate-300">Servicios</span>
          </span>
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
          {navigation.map((item) => (
            <a
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-orange-400"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <PublicMobileNav items={navigation} />
      </div>
    </header>
  );
}
