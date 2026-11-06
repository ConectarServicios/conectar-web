import { Cable, CalendarClock, Headset, Smartphone } from "lucide-react";

import { HeroBenefits } from "@/components/public/hero-benefits";

const highlights = [
  {
    title: "Fibra óptica propia",
    detail: "Conectividad directa hasta tu hogar",
    icon: Cable,
  },
  {
    title: "Atención local",
    detail: "Equipo en Sunchales",
    icon: Headset,
  },
  {
    title: "Soporte también los fines de semana",
    detail: "Sábados, domingos y feriados",
    icon: CalendarClock,
  },
  {
    title: "Autogestión 24/7",
    detail: "Gestioná tu cuenta cuando quieras",
    icon: Smartphone,
  },
] as const;

export function HomeHighlights() {
  return <HeroBenefits items={highlights} />;
}
