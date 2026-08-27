const footerNavigation = [
  { href: "#inicio", label: "Inicio" },
  { href: "#planes", label: "Planes" },
  { href: "#servicios", label: "Servicios" },
  { href: "#contacto", label: "Contacto" },
];

export function PublicFooter() {
  return (
    <footer className="bg-[#061526] py-12 text-slate-300">
      <div className="public-container flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-lg font-bold text-white">Conectar Servicios</p>
          <p className="mt-2 text-sm">Soluciones de conectividad.</p>
        </div>
        <div className="sm:text-right">
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Navegación del pie de página">
            {footerNavigation.map((item) => (
              <a className="rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-orange-400" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <p className="mt-5 text-xs text-slate-400">
            © {new Date().getFullYear()} Conectar Servicios
          </p>
        </div>
      </div>
    </footer>
  );
}
