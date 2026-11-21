import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabaseConfig } from "@/lib/supabase/config";
import { createServerTransport } from "@/lib/supabase/server-transport";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { publishableKey, url } = getSupabaseConfig();

  const transport = createServerTransport();
  const supabase = transport.bind(transport.construct(() => createServerClient(url, publishableKey, {
    db: { retry: false },
    auth: { skipAutoInitialize: true },
    global: { fetch: transport.fetch },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, options, value }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  })));

  // Validating claims refreshes expired tokens and persists the new cookies.
  await supabase.auth.getClaims();

  return response;
}
