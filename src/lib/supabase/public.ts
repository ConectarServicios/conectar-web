import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/lib/supabase/config";
import { createServerTransport } from "@/lib/supabase/server-transport";

/** Content only: never reads cookies, creates an Auth session or refreshes tokens. */
export async function createPublicClient() {
  const { url, publishableKey } = getSupabaseConfig();
  const transport = createServerTransport();
  return transport.bind(createClient(url, publishableKey, {
    db: { retry: false },
    // A null access token uses only the publishable key and disables Auth entirely.
    accessToken: async () => null,
    global: { fetch: (input, init) => transport.fetch(input, { ...init, cache: "no-store" }) },
  }), "public");
}
