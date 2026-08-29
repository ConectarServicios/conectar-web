import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function HeroAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("active, role").eq("id", user.id).maybeSingle();
  if (!profile?.active || !["admin", "super_admin"].includes(profile.role)) redirect("/auth/unauthorized");
  return children;
}
