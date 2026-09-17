import type { Metadata } from "next";

import { ContactSection } from "@/components/public/contact-section";
import { HeroSection } from "@/components/public/hero-section";
import { HomeCorporativoContent } from "@/components/public/home-corporativo-content";
import { getPublicContactInformation } from "@/lib/supabase/contact-information";

export const metadata: Metadata = {
  title: "Soluciones corporativas | Conectar Servicios",
  description:
    "Conectividad de fibra, nube privada, servidores y ciberseguridad para empresas y organizaciones.",
  alternates: { canonical: "/corporativo" },
};

export default async function CorporativoPage() {
  const contact = await getPublicContactInformation();

  return (
    <main>
      <HeroSection segment="corporativo" />
      <HomeCorporativoContent />
      <ContactSection
        contact={contact.data}
        homeCorporativo
        unavailable={contact.unavailable}
      />
    </main>
  );
}
