import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HeroSlideForm } from "@/components/admin/hero/hero-slide-form";
import { createClient } from "@/lib/supabase/server";
import type { HeroSlide } from "@/types/hero";

export default async function EditHeroSlidePage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params; const supabase = await createClient();
  const { data, error } = await supabase.from("hero_slides").select("id, title, subtitle, image_path, button_text, button_url, active, featured, display_order").eq("id", id).maybeSingle();
  if (error) console.error("Unable to load hero slide", error); if (!data || error) notFound();
  const { id: slideId, ...values } = data as HeroSlide;
  return <><AdminPageHeader description={`Actualizá el contenido y la imagen de ${values.title}.`} title="Editar slide" /><HeroSlideForm id={slideId} initialValues={values} /></>;
}
