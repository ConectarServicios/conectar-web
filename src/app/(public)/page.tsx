import type { Metadata } from "next";

import { HeroSection } from "@/components/public/hero-section";
import { HomeCorporativoContent } from "@/components/public/home-corporativo-content";
import { HomeSegmentContent } from "@/components/public/home-segment-content";
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
import { getPublicSiteConfiguration } from "@/lib/supabase/site-settings";
import { FaqHomeSection } from "@/components/public/faq-home-section";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
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

export default async function HomePage() {
  const [plans, siteConfiguration, playSettings, playPlans, contact, news, promotions, events, featuredFaqs] = await Promise.all([
    getPublicPlans(),
    getPublicSiteConfiguration(),
    getPlaySettings(),
    getPlayPlans(),
    getPublicContactInformation(),
    getPublicNews(3),
    getPublicPromotions("home", 3),
    getUpcomingPublicEvents(3),
    getFeaturedFaqs(6),
  ]);
  const supabase = await createClient();
  const newsImages = Object.fromEntries(news.map((item) => [item.id, newsImageUrl(supabase, item.cover_image)]));
  const promotionImages = Object.fromEntries(promotions.map((item) => [item.id, promotionImageUrl(supabase, item.image_path)]));
  const eventImages = Object.fromEntries(events.map((item) => [item.id, eventImageUrl(supabase, item.image_path)]));

  return (
    <main>
      <HeroSection />
      <HomeSegmentContent
        corporativo={<HomeCorporativoContent />}
        hogar={(
          <>
            <PromotionsSection imageUrls={promotionImages} items={promotions} />
            <PlansSection
              installationBenefitsText={siteConfiguration.internetInstallationBenefitsText}
              installationPrice={siteConfiguration.internetInstallationPrice}
              plans={plans.data}
              unavailable={plans.unavailable}
            />
            <ContextualPromotions exclude={promotions.map((item) => item.id)} placement="plans" />
            <ConectarPlayHomeSection settings={playSettings.data} plans={playPlans.data} unavailable={playSettings.unavailable || playPlans.unavailable} />
            <HomeSecuritySection />
            <HomeServicesSection />
            <HomeSocialProofSection />
            <EventsHomeSection imageUrls={eventImages} items={events} />
            <InstitutionalSection />
            <NewsHomeSection imageUrls={newsImages} items={news} />
            <FaqHomeSection items={featuredFaqs} />
          </>
        )}
      />
      <ContactSection contact={contact.data} unavailable={contact.unavailable} />
    </main>
  );
}
