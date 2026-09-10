import { Building2, CirclePlay, Code2, Layers3, Server, ShieldCheck, Wifi, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  wifi: Wifi,
  play: CirclePlay,
  security: ShieldCheck,
  business: Building2,
  server: Server,
  software: Code2,
};

export function ServiceAreaIcon({ icon }: Readonly<{ icon: string | null }>) {
  const Icon = icon ? (icons[icon.toLowerCase()] ?? Layers3) : Layers3;

  return <span aria-hidden="true" className="grid size-12 place-items-center rounded-2xl bg-blue-950 text-white"><Icon size={24} strokeWidth={2.25} /></span>;
}
