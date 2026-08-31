"use server";

import { revalidatePath } from "next/cache";

import {
  SITE_SETTING_DESCRIPTIONS,
  SITE_SETTING_KEYS,
} from "@/lib/supabase/site-settings";
import { createClient } from "@/lib/supabase/server";
import {
  parseIdentitySettings,
  parseInternetSettings,
  parseSeoSettings,
} from "@/lib/validations/site-settings";
import type { SettingsActionState, SiteConfiguration } from "@/types/site-settings";

async function getAuthorizedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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

async function persistSettings(values: Partial<SiteConfiguration>): Promise<SettingsActionState> {
  const supabase = await getAuthorizedClient();
  if (!supabase) return { message: "No tenés permiso para realizar esta acción." };

  const rows = (Object.entries(values) as [keyof SiteConfiguration, string | number][]).map(
    ([field, value]) => ({
      key: SITE_SETTING_KEYS[field],
      value,
      is_public: true,
      description: SITE_SETTING_DESCRIPTIONS[field],
    }),
  );
  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });

  if (error) {
    console.error("Unable to persist site configuration", error);
    return { message: "No pudimos guardar la configuración. Intentá nuevamente." };
  }

  return { success: true, message: "Los cambios se guardaron correctamente." };
}

const invalidState = (fieldErrors: Record<string, string>): SettingsActionState => ({
  message: "Revisá los campos marcados.",
  fieldErrors,
});

function revalidatePublicLayout() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function saveInternetSettings(
  _previous: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = parseInternetSettings(formData);
  if (!parsed.values) return invalidState(parsed.fieldErrors);
  const state = await persistSettings(parsed.values);
  if (state.success) revalidatePublicLayout();
  return state;
}

export async function saveIdentitySettings(
  _previous: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = parseIdentitySettings(formData);
  if (!parsed.values) return invalidState(parsed.fieldErrors);
  const state = await persistSettings(parsed.values);
  if (state.success) revalidatePublicLayout();
  return state;
}

export async function saveSeoSettings(
  _previous: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = parseSeoSettings(formData);
  if (!parsed.values) return invalidState(parsed.fieldErrors);
  const state = await persistSettings(parsed.values);
  if (state.success) revalidatePublicLayout();
  return state;
}
