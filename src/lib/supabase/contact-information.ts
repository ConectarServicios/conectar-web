import { cache } from "react";
import { unstable_rethrow } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { ContactInformation } from "@/types/contact-information";

export type PublicContactInformation = {
  data: ContactInformation | null;
  unavailable: boolean;
};

export const getPublicContactInformation = cache(async (): Promise<PublicContactInformation> => {
  try {
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
  } catch (error) {
    unstable_rethrow(error);
    console.error("Unable to initialize public contact information query", error);
    return { data: null, unavailable: true };
  }
});
