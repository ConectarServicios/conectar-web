"use client";

import "client-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/lib/supabase/config";

/**
 * Isolated implicit-flow client for consuming Supabase invitation fragments.
 * It intentionally neither reads nor persists the application's SSR session.
 */
export function createInvitationClient() {
  const { publishableKey, url } = getSupabaseConfig();

  return createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: true,
      flowType: "implicit",
      persistSession: false,
    },
  });
}
