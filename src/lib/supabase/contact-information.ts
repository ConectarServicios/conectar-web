import { publicFailure } from "@/lib/supabase/public-result";
import { validDetail, validContact } from "@/lib/supabase/public-cache-validation";
import { publicRead } from "@/lib/supabase/public-read";
import { PUBLIC_CACHE_POLICY } from "@/lib/supabase/public-cache";
import { cache } from "react";

import { createPublicClient } from "@/lib/supabase/public";
import type { ContactInformation } from "@/types/contact-information";

export type PublicContactInformation = {
  data: ContactInformation | null;
  unavailable: boolean;
};

export const getPublicContactInformation = cache(async (): Promise<PublicContactInformation> => {
  return publicRead("getPublicContactInformation", { data: null, unavailable: true } as PublicContactInformation, async () => {

  const supabase = await createPublicClient();
    const { data, error, status } = await supabase
      .from("contact_information")
      .select("id, phone, whatsapp, commercial_email, address, business_hours, guard_hours")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Unable to load public contact information", error);
      return publicFailure(null, status);
    }

    return { data: data as ContactInformation | null, unavailable: false };

  }, { domain: "contact", key: "main", policy: PUBLIC_CACHE_POLICY.information, valid: value => validDetail(value, validContact) });
});
