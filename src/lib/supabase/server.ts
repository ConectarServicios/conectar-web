import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseConfig } from "@/lib/supabase/config";
import { createServerTransport } from "@/lib/supabase/server-transport";
import type { SupabaseReadMode } from "@/lib/supabase/operation-policy";

export async function createClient(mode: SupabaseReadMode = "admin") {
  const cookieStore = await cookies();
  const { publishableKey, url } = getSupabaseConfig();

  const transport = createServerTransport();
  return transport.bind(transport.construct(() => createServerClient(url, publishableKey, {
    db: { retry: false },
    auth: { skipAutoInitialize: true },
    global: { fetch: transport.fetch },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot write cookies. Proxy handles refreshes.
        }
      },
    },
  })), mode);
}
