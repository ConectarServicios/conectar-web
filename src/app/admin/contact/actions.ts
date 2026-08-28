"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { parseContactHours } from "@/lib/validations/contact-information";
import type { ContactInformationActionState } from "@/types/contact-information";

export async function saveContactHours(
  previous: ContactInformationActionState,
  formData: FormData,
): Promise<ContactInformationActionState> {
  const parsed = parseContactHours(formData);
  if (parsed.fieldErrors) {
    return { message: "Revisá los campos marcados.", fieldErrors: parsed.fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: "No tenés permiso para realizar esta acción." };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("active, role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) console.error("Unable to authorize contact information update", profileError);
  if (!profile?.active || !["admin", "super_admin"].includes(profile.role)) {
    return { message: "No tenés permiso para realizar esta acción." };
  }

  const { data: contact, error: loadError } = await supabase
    .from("contact_information")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (loadError) {
    console.error("Unable to load contact information for update", loadError);
    return { message: "No pudimos guardar los horarios. Intentá nuevamente." };
  }

  const values = {
    business_hours: parsed.businessHours,
    guard_hours: parsed.guardHours,
  };
  const { error } = contact
    ? await supabase.from("contact_information").update(values).eq("id", contact.id)
    : await supabase.from("contact_information").insert(values);

  if (error) {
    console.error("Unable to persist contact hours", error);
    return { message: "No pudimos guardar los horarios. Intentá nuevamente." };
  }

  revalidatePath("/");
  revalidatePath("/admin/contact");
  return { success: true, message: "Los horarios se guardaron correctamente." };
}
