import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SocialLinkForm } from "@/components/admin/social/social-link-form";
import { createClient } from "@/lib/supabase/server";
import type { SocialLink } from "@/types/social-links";

export default async function EditSocialLinkPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("social_links").select("id, platform, url, active, display_order").eq("id", id).maybeSingle();
  if (error) console.error("Unable to load social link for editing", error);
  if (!data || error) notFound();
  const socialLink = data as SocialLink;
  const { id: socialLinkId, ...initialValues } = socialLink;
  return <><AdminPageHeader description={`Actualizá el enlace oficial de ${socialLink.platform}.`} title="Editar red social" /><SocialLinkForm id={socialLinkId} initialValues={initialValues} /></>;
}
