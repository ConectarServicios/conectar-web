import { PUBLIC_CACHE_POLICY } from "@/lib/supabase/public-cache";
import { successful } from "@/lib/supabase/public-cache-validation";
import { Suspense } from "react";
import { publicRead } from "@/lib/supabase/public-read";
import type { Metadata } from "next";
import styles from "./home-identity.module.css";

import { HeroSection } from "@/components/public/hero-section";
import { ConectarPlayHomeSection } from "@/components/public/conectar-play-home-section";
import { PlansSection } from "@/components/public/plans-section";
import { HomeSocialProofSection } from "@/components/public/home-social-proof-section";
import { ContactSection } from "@/components/public/contact-section";
import { createPublicClient } from "@/lib/supabase/public";
import { getPlayPlans, getPlaySettings } from "@/lib/supabase/conectar-play";
import type { Plan } from "@/types/plans";
import { getPublicContactInformation } from "@/lib/supabase/contact-information";
import { NewsHomeSection } from "@/components/public/news-home-section";
import { getPublicFeaturedAlert, getPublicNews, newsImageUrl } from "@/lib/supabase/news";
import { getPublicPromotions, promotionImageUrl } from "@/lib/supabase/promotions";
import { PromotionsSection } from "@/components/public/promotions-section";
import { ContextualPromotions } from "@/components/public/contextual-promotions";
import { EventsHomeSection } from "@/components/public/events-home-section";
import { eventImageUrl, getUpcomingPublicEvents } from "@/lib/supabase/events";
import { getFeaturedFaqs } from "@/lib/supabase/faqs";
import {
  getPublicInstallationConfiguration,
  getPublicSiteConfiguration,
} from "@/lib/supabase/site-settings";
import { FaqHomeSection } from "@/components/public/faq-home-section";
import { ConnectionToolsSection } from "@/components/public/connection-tools-section";
import { SelfServiceSection } from "@/components/public/self-service-section";

export const metadata: Metadata = {
  title: "Internet para hogares | Conectar Servicios",
  description: "Fibra óptica estable y rápida, televisión con Conectar Play y alarmas y cámaras para cuidar tu casa.",
  alternates: { canonical: "https://conectarservicios.com.ar/" },
  robots: { index: true, follow: true },
};

type PublicData<T> = {
  data: T[];
  unavailable: boolean;
};

async function getPublicPlans(): Promise<PublicData<Plan>> {
  return publicRead<PublicData<Plan>>("getPublicPlans", { data: [], unavailable: true }, async () => {
    const supabase = await createPublicClient();
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
  }, { domain: "plans", key: "home", policy: PUBLIC_CACHE_POLICY.live, valid: successful });
}

export default function HogarPage() {
  const promotions = getPublicPromotions("home", 3);
  return (
    <main className={styles.home}>
      <Suspense fallback={<HeroSection alert={null} segment="hogar" />}><HomeHero /></Suspense>
      <Suspense fallback={null}><HomeTools /></Suspense>
      <Suspense fallback={null}><HomePromotions result={promotions} /></Suspense>
      <Suspense fallback={null}><HomePlans /></Suspense>
      <Suspense fallback={null}><ContextualPromotions exclude={promotions.then(result => result.data.map(item => item.id))} placement="plans" /></Suspense>
      <Suspense fallback={null}><HomePlay /></Suspense>
      <Suspense fallback={null}><HomeNews /></Suspense>
      <Suspense fallback={null}><HomeSelfService /></Suspense>
      <Suspense fallback={null}><HomeEvents /></Suspense>
      <HomeSocialProofSection />
      <Suspense fallback={null}><HomeFaqs /></Suspense>
      <Suspense fallback={null}><HomeContact /></Suspense>
    </main>
  );
}

async function HomeHero() {
  const alert = await getPublicFeaturedAlert();
  return <HeroSection alert={alert.data} segment="hogar" />;
}
async function HomeTools() {
  const contact = await getPublicContactInformation();
  return <ConnectionToolsSection whatsapp={contact.data?.whatsapp ?? null} />;
}
async function HomePromotions({ result }: { result: ReturnType<typeof getPublicPromotions> }) {
  const promotions = await result;
  const supabase = promotions.data.length ? await createPublicClient() : null;
  const images = Object.fromEntries(promotions.data.map(item => [item.id, promotionImageUrl(supabase!, item.image_path)]));
  return promotions.unavailable ? <UnavailableSection>Las promociones no están disponibles temporalmente.</UnavailableSection> : <PromotionsSection imageUrls={images} items={promotions.data} />;
}
async function HomePlans() {
  const [plans, installation, contact] = await Promise.all([getPublicPlans(), getPublicInstallationConfiguration(), getPublicContactInformation()]);
  return <PlansSection installationBenefitsText={installation.benefitsText} installationInstallmentCount={installation.installmentCount} installationInstallmentPrice={installation.installmentPrice} installationPrice={installation.price} plans={plans.data} unavailable={plans.unavailable} whatsapp={contact.data?.whatsapp ?? null} />;
}
async function HomePlay() {
  const [settings, plans] = await Promise.all([getPlaySettings(), getPlayPlans()]);
  return <ConectarPlayHomeSection settings={settings.data} plans={plans.data} unavailable={settings.unavailable || plans.unavailable} />;
}
async function HomeNews() {
  const news = await getPublicNews(3);
  const supabase = news.data.length ? await createPublicClient() : null;
  const images = Object.fromEntries(news.data.map(item => [item.id, newsImageUrl(supabase!, item.cover_image)]));
  return news.unavailable ? <UnavailableSection>Las noticias no están disponibles temporalmente.</UnavailableSection> : <NewsHomeSection imageUrls={images} items={news.data} />;
}
async function HomeSelfService() {
  const configuration = await getPublicSiteConfiguration();
  return <SelfServiceSection href={configuration.selfServiceUrl} />;
}
async function HomeEvents() {
  const events = await getUpcomingPublicEvents(3);
  const supabase = events.data.length ? await createPublicClient() : null;
  const images = Object.fromEntries(events.data.map(item => [item.id, eventImageUrl(supabase!, item.image_path)]));
  return events.unavailable ? <UnavailableSection>Los eventos no están disponibles temporalmente.</UnavailableSection> : <EventsHomeSection imageUrls={images} items={events.data} />;
}
async function HomeFaqs() {
  const faqs = await getFeaturedFaqs(6);
  return faqs.unavailable ? <UnavailableSection>Las preguntas frecuentes no están disponibles temporalmente.</UnavailableSection> : <FaqHomeSection items={faqs.data} />;
}
async function HomeContact() {
  const contact = await getPublicContactInformation();
  return <ContactSection contact={contact.data} homeHogar unavailable={contact.unavailable} />;
}

function UnavailableSection({ children }: Readonly<{ children: string }>) {
  return <section className="bg-slate-50 py-8"><div className="public-container"><p className="public-empty-state mt-0 p-5 sm:p-6" role="status">{children}</p></div></section>;
}
