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

export default async function HomePage() {
  const [plans, services, installationPrice, installationBenefitsText, playSettings, playPlans, contact] = await Promise.all([
    getPublicPlans(),
    getPublicServices(),
    getInstallationPrice(),
    getInstallationBenefitsText(),
    getPlaySettings(),
    getPlayPlans(),
    getContactInformation(),
  ]);

  return (
    <main>
      <HeroSection />
      <PlansSection installationBenefitsText={installationBenefitsText} installationPrice={installationPrice} plans={plans.data} unavailable={plans.unavailable} />
      <ConectarPlayHomeSection settings={playSettings.data} plans={playPlans.data} unavailable={playSettings.unavailable || playPlans.unavailable} />
      <ServicesSection
        services={services.data}
        unavailable={services.unavailable}
      />
      <InstitutionalSection />
      <FinalCta />
      <ContactSection contact={contact.data} unavailable={contact.unavailable} />
    </main>
  );
}
