"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { parseInstallationBenefitsText, parseInstallationPrice } from "@/lib/validations/site-settings";
import type { InstallationBenefitsActionState, InstallationPriceActionState } from "@/types/site-settings";

const INSTALLATION_PRICE_KEY = "internet_installation_price";
const INSTALLATION_BENEFITS_KEY = "internet_installation_benefits_text";

async function getAuthorizedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("active, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) console.error("Unable to authorize site settings update", error);
  if (!profile?.active || !["admin", "super_admin"].includes(profile.role)) return null;
  return supabase;
}

export async function saveInstallationPrice(
  previous: InstallationPriceActionState,
  formData: FormData,
): Promise<InstallationPriceActionState> {
  const parsed = parseInstallationPrice(formData);
  if (parsed.value === undefined) {
    return { message: "Revisá el campo marcado.", fieldError: parsed.error };
  }

  const supabase = await getAuthorizedClient();
  if (!supabase) return { message: "No tenés permiso para realizar esta acción." };

  const { error } = await supabase.from("site_settings").upsert({
    key: INSTALLATION_PRICE_KEY,
    value: parsed.value,
    is_public: true,
    description: "Precio vigente de instalación del servicio de Internet",
  }, { onConflict: "key" });

  if (error) {
    console.error("Unable to persist internet installation price", error);
    return { message: "No pudimos guardar la configuración. Intentá nuevamente." };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true, message: "La configuración se guardó correctamente." };
}

export async function saveInstallationBenefitsText(
  previous: InstallationBenefitsActionState,
  formData: FormData,
): Promise<InstallationBenefitsActionState> {
  const parsed = parseInstallationBenefitsText(formData);
  if (parsed.value === undefined) {
    return { message: "Revisá el campo marcado.", fieldError: parsed.error };
  }

  const supabase = await getAuthorizedClient();
  if (!supabase) return { message: "No tenés permiso para realizar esta acción." };

  const { error } = await supabase.from("site_settings").upsert({
    key: INSTALLATION_BENEFITS_KEY,
    value: parsed.value,
    is_public: true,
    description: "Texto público sobre beneficios y bonificaciones de instalación de Internet",
  }, { onConflict: "key" });

  if (error) {
    console.error("Unable to persist internet installation benefits text", error);
    return { message: "No pudimos guardar la configuración. Intentá nuevamente." };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true, message: "La configuración se guardó correctamente." };
}
