import { FinalCta } from "@/components/public/final-cta";
import { HeroSection } from "@/components/public/hero-section";
import { InstitutionalSection } from "@/components/public/institutional-section";
import { ConectarPlayHomeSection } from "@/components/public/conectar-play-home-section";
import { PlansSection } from "@/components/public/plans-section";
import { ServicesSection } from "@/components/public/services-section";
import { ContactSection } from "@/components/public/contact-section";
import { createClient } from "@/lib/supabase/server";
import { getPlayPlans, getPlaySettings } from "@/lib/supabase/conectar-play";
import type { Plan } from "@/types/plans";
import type { Service } from "@/types/services";
import type { ContactInformation } from "@/types/contact-information";
import type { PublicHeroSlide } from "@/components/public/hero-section";
import { NewsHomeSection } from "@/components/public/news-home-section";
import { getPublicNews, newsImageUrl } from "@/lib/supabase/news";
import { getPublicPromotions, promotionImageUrl } from "@/lib/supabase/promotions";
import { PromotionsSection } from "@/components/public/promotions-section";
import { ContextualPromotions } from "@/components/public/contextual-promotions";
import { EventsHomeSection } from "@/components/public/events-home-section";
import { eventImageUrl, getUpcomingPublicEvents } from "@/lib/supabase/events";
import { getFeaturedFaqs } from "@/lib/supabase/faqs";
import { FaqHomeSection } from "@/components/public/faq-home-section";

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

async function getInstallationPrice(): Promise<number | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "internet_installation_price")
    .eq("is_public", true)
    .maybeSingle();

  if (error) {
    console.error("Unable to load public internet installation price", error);
    return null;
  }

  return typeof data?.value === "number" && Number.isFinite(data.value) && data.value >= 0
    ? data.value
    : null;
}

async function getInstallationBenefitsText(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "internet_installation_benefits_text")
    .eq("is_public", true)
    .maybeSingle();

  if (error) {
    console.error("Unable to load public internet installation benefits text", error);
    return null;
  }

  return typeof data?.value === "string" && data.value.trim() ? data.value : null;
}

async function getPublicServices(): Promise<PublicData<Service>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, name, slug, short_description, description, image_url, icon, category, featured, active, display_order",
    )
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Unable to load public services", error);
    return { data: [], unavailable: true };
  }

  return { data: (data ?? []) as Service[], unavailable: false };
}

async function getContactInformation(): Promise<{ data: ContactInformation | null; unavailable: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_information")
    .select("id, phone, whatsapp, commercial_email, address, business_hours, guard_hours")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Unable to load public contact information", error);
    return { data: null, unavailable: true };
  }
  return { data: data as ContactInformation | null, unavailable: false };
}

async function getHeroSlides(): Promise<PublicHeroSlide[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("hero_slides")
    .select("id, title, subtitle, image_path, button_text, button_url, featured, display_order")
    .eq("active", true).order("featured", { ascending: false }).order("display_order", { ascending: true }).limit(3);
  if (error) { console.error("Unable to load public hero slides", error); return []; }
  return (data ?? []).map((slide) => ({ id: slide.id, title: slide.title, subtitle: slide.subtitle, buttonText: slide.button_text, buttonUrl: slide.button_url, imageUrl: supabase.storage.from("hero-banners").getPublicUrl(slide.image_path).data.publicUrl, featured: slide.featured, external: /^https?:\/\//.test(slide.button_url ?? "") }));
}

export default async function HomePage() {
  const [plans, services, installationPrice, installationBenefitsText, playSettings, playPlans, contact, heroSlides, news, promotions, events, featuredFaqs] = await Promise.all([
    getPublicPlans(),
    getPublicServices(),
    getInstallationPrice(),
    getInstallationBenefitsText(),
    getPlaySettings(),
    getPlayPlans(),
    getContactInformation(),
    getHeroSlides(),
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
      <HeroSection slides={heroSlides} />
      <PromotionsSection imageUrls={promotionImages} items={promotions} />
      <PlansSection installationBenefitsText={installationBenefitsText} installationPrice={installationPrice} plans={plans.data} unavailable={plans.unavailable} />
      <ContextualPromotions exclude={promotions.map((item) => item.id)} placement="plans" />
      <ConectarPlayHomeSection settings={playSettings.data} plans={playPlans.data} unavailable={playSettings.unavailable || playPlans.unavailable} />
      <ServicesSection
        services={services.data}
        unavailable={services.unavailable}
      />
      <EventsHomeSection imageUrls={eventImages} items={events} />
      <InstitutionalSection />
      <NewsHomeSection imageUrls={newsImages} items={news} />
      <FaqHomeSection items={featuredFaqs} />
      <FinalCta />
      <ContactSection contact={contact.data} unavailable={contact.unavailable} />
    </main>
  );
}
