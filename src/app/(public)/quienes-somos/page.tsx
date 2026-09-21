import type { Metadata } from "next";

import { InstitutionalSection } from "@/components/public/institutional-section";

export const metadata: Metadata = {
  title: "Quiénes somos | Conectar Servicios",
  description:
    "Conocé a Conectar Servicios, una empresa de Sunchales que brinda conectividad y soluciones tecnológicas a la región.",
  alternates: { canonical: "/quienes-somos" },
};

export default function QuienesSomosPage() {
  return (
    <main>
      <InstitutionalSection page />
    </main>
  );
}
