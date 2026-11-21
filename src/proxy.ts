import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Public content is anonymous. Private pages still validate the user/profile
  // in their layout/actions; auth routes retain cookie refresh behavior.
  matcher: ["/admin/:path*", "/auth/:path*"],
};
