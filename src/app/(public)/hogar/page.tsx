import type { Metadata } from "next";

import { HeroSection } from "@/components/public/hero-section";
import { InstitutionalSection } from "@/components/public/institutional-section";
import { ConectarPlayHomeSection } from "@/components/public/conectar-play-home-section";
import { PlansSection } from "@/components/public/plans-section";
import { HomeSecuritySection } from "@/components/public/home-security-section";
import { HomeServicesSection } from "@/components/public/home-services-section";
import { HomeSocialProofSection } from "@/components/public/home-social-proof-section";
import { ContactSection } from "@/components/public/contact-section";
import { createClient } from "@/lib/supabase/server";
import { getPlayPlans, getPlaySettings } from "@/lib/supabase/conectar-play";
import type { Plan } from "@/types/plans";
import { getPublicContactInformation } from "@/lib/supabase/contact-information";
import { NewsHomeSection } from "@/components/public/news-home-section";
import { getPublicNews, newsImageUrl } from "@/lib/supabase/news";
import { getPublicPromotions, promotionImageUrl } from "@/lib/supabase/promotions";
import { PromotionsSection } from "@/components/public/promotions-section";
import { ContextualPromotions } from "@/components/public/contextual-promotions";
import { EventsHomeSection } from "@/components/public/events-home-section";
import { eventImageUrl, getUpcomingPublicEvents } from "@/lib/supabase/events";
import { getFeaturedFaqs } from "@/lib/supabase/faqs";
import { getPublicInstallationConfiguration } from "@/lib/supabase/site-settings";
import { FaqHomeSection } from "@/components/public/faq-home-section";

export const metadata: Metadata = {
  title: "Internet para hogares | Conectar Servicios",
  description: "Fibra óptica estable y rápida, televisión con Conectar Play y alarmas y cámaras para cuidar tu casa.",
  alternates: { canonical: "/hogar" },
};

type PublicData<T> = {
  data: T[];
  unavailable: boolean;
};

async function getPublicPlans(): Promise<PublicData<Plan>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plans")
    .select(
      "id, name, slug, speed_mbps, upload_speed_mbps, description, regular_price, promotional_price, promotion_label, promotion_start, promotion_end, featured, active, display_order, plan_features(id, text, display_order)",
    )
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("speed_mbps", { ascending: true })
    .order("name", { ascending: true })
    .order("display_order", {
      ascending: true,
      referencedTable: "plan_features",
    });

  if (error) {
    console.error("Unable to load public plans", error);
    return { data: [], unavailable: true };
  }

  return { data: (data ?? []) as Plan[], unavailable: false };
}

export default async function HogarPage() {
  const [plans, installation, playSettings, playPlans, contact, news, promotions, events, featuredFaqs] = await Promise.all([
    getPublicPlans(),
    getPublicInstallationConfiguration(),
    getPlaySettings(),
    getPlayPlans(),
    getPublicContactInformation(),
    getPublicNews(3),
    getPublicPromotions("home", 3),
    getUpcomingPublicEvents(3),
    getFeaturedFaqs(6),
  ]);
  const supabase = await createClient();
  const newsImages = Object.fromEntries(news.data.map((item) => [item.id, newsImageUrl(supabase, item.cover_image)]));
  const promotionImages = Object.fromEntries(promotions.data.map((item) => [item.id, promotionImageUrl(supabase, item.image_path)]));
  const eventImages = Object.fromEntries(events.data.map((item) => [item.id, eventImageUrl(supabase, item.image_path)]));

  return (
    <main>
      <HeroSection segment="hogar" />
      {promotions.unavailable ? <UnavailableSection>Las promociones no están disponibles temporalmente.</UnavailableSection> : <PromotionsSection imageUrls={promotionImages} items={promotions.data} />}
      <PlansSection
        installationBenefitsText={installation.benefitsText}
        installationPrice={installation.price}
        plans={plans.data}
        unavailable={plans.unavailable}
      />
      <ContextualPromotions exclude={promotions.data.map((item) => item.id)} placement="plans" />
      <ConectarPlayHomeSection settings={playSettings.data} plans={playPlans.data} unavailable={playSettings.unavailable || playPlans.unavailable} />
      <HomeSecuritySection />
      {events.unavailable ? <UnavailableSection>Los eventos no están disponibles temporalmente.</UnavailableSection> : <EventsHomeSection imageUrls={eventImages} items={events.data} />}
      <InstitutionalSection />
      {news.unavailable ? <UnavailableSection>Las noticias no están disponibles temporalmente.</UnavailableSection> : <NewsHomeSection imageUrls={newsImages} items={news.data} />}
      <HomeServicesSection />
      <HomeSocialProofSection />
      {featuredFaqs.unavailable ? <UnavailableSection>Las preguntas frecuentes no están disponibles temporalmente.</UnavailableSection> : <FaqHomeSection items={featuredFaqs.data} />}
      <ContactSection contact={contact.data} homeHogar unavailable={contact.unavailable} />
    </main>
  );
}

function UnavailableSection({ children }: Readonly<{ children: string }>) {
  return <section className="bg-slate-50 py-8"><div className="public-container"><p className="public-empty-state" role="status">{children}</p></div></section>;
}
