import Link from "next/link";
import { unstable_rethrow } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isSocialPlatform, type SocialLink, type SocialPlatform } from "@/types/social-links";

const footerNavigation = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#planes", label: "Planes" },
  { href: "/promociones", label: "Promociones" },
  { href: "/eventos", label: "Eventos" },
  { href: "/conectar-play", label: "Conectar Play" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#contacto", label: "Contacto" },
];

function SocialIcon({ platform }: Readonly<{ platform: SocialPlatform }>) {
  const common = { className: "size-5", fill: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true } as const;
  if (platform === "Instagram") return <svg {...common}><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>;
  if (platform === "Facebook") return <svg {...common}><path d="M13.8 22v-9h3l.45-3.5H13.8V7.26c0-1.01.28-1.7 1.73-1.7h1.85V2.43a24.7 24.7 0 0 0-2.7-.14c-2.67 0-4.5 1.63-4.5 4.62V9.5h-3.02V13h3.02v9h3.62Z" /></svg>;
  if (platform === "YouTube") return <svg {...common}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.55 3.6 12 3.6 12 3.6s-7.55 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.85.5 9.4.5 9.4.5s7.55 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.27 3.6-6.27 3.6Z" /></svg>;
  return <svg {...common}><path d="M5.34 7.5H1.78V22h3.56V7.5ZM3.56 2A2.07 2.07 0 1 0 3.56 6.14 2.07 2.07 0 0 0 3.56 2ZM22 13.68c0-4.37-2.33-6.4-5.44-6.4a4.7 4.7 0 0 0-4.26 2.34V7.5H8.74V22h3.56v-7.18c0-1.9.36-3.73 2.71-3.73 2.32 0 2.35 2.17 2.35 3.85V22H22v-8.32Z" /></svg>;
}

async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("social_links").select("id, platform, url, active, display_order")
      .eq("active", true).order("display_order", { ascending: true }).order("platform", { ascending: true });
    if (error) {
      console.error("Unable to load public social links", error);
      return [];
    }
    return (data ?? []).filter((link): link is SocialLink => isSocialPlatform(link.platform));
  } catch (error) {
    unstable_rethrow(error);
    console.error("Unable to initialize social links query", error);
    return [];
  }
}

export async function PublicFooter() {
  const socialLinks = await getSocialLinks();
  return (
    <footer className="bg-[#061526] py-12 text-slate-300">
      <div className="public-container flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-lg font-bold text-white">Conectar Servicios</p>
          <p className="mt-2 text-sm">Soluciones de conectividad.</p>
          {socialLinks.length > 0 && <nav className="mt-5 flex flex-wrap gap-3" aria-label="Redes sociales">
            {socialLinks.map((socialLink) => <a className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-orange-400" href={socialLink.url} key={socialLink.id} target="_blank" rel="noopener noreferrer" aria-label={`Visitar ${socialLink.platform} de Conectar Servicios (abre en una pestaña nueva)`}><SocialIcon platform={socialLink.platform} /><span>{socialLink.platform}</span></a>)}
          </nav>}
        </div>
        <div className="sm:text-right">
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Navegación del pie de página">
            {footerNavigation.map((item) => <Link className="rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-orange-400" href={item.href} key={item.href}>{item.label}</Link>)}
          </nav>
          <p className="mt-5 text-xs text-slate-400">© {new Date().getFullYear()} Conectar Servicios</p>
        </div>
      </div>
    </footer>
  );
}
