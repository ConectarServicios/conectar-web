import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/lib/supabase/config";
import { createServerTransport } from "@/lib/supabase/server-transport";

export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Falta configurar SUPABASE_SERVICE_ROLE_KEY.");
  }

  const transport = createServerTransport();
  return transport.bind(transport.construct(() => createClient(getSupabaseConfig().url, serviceRoleKey, {
    db: { retry: false },
    global: { fetch: transport.fetch },
    auth: { autoRefreshToken: false, persistSession: false, skipAutoInitialize: true },
  })));
}
