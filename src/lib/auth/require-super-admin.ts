import "server-only";

import { createClient } from "@/lib/supabase/server";
import { administrativeRead } from "@/lib/supabase/operation-error";

export async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await administrativeRead(supabase.auth.getUser());

  if (userError || !user) return null;

  const { data: profile, error: profileError } = await administrativeRead(supabase
    .from("profiles")
    .select("id, active, role")
    .eq("id", user.id)
    .maybeSingle());

  if (profileError) {
    console.error("Unable to authorize users administration", profileError);
    return null;
  }

  return profile?.active && profile.role === "super_admin"
    ? { supabase, user }
    : null;
}
