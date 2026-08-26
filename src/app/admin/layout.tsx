import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/admin/logout-button";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_ROLE_LABELS, isAdminRole } from "@/types/admin";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

type AdminLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, role, active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    // Fail closed: log diagnostics only on the server and show the same safe
    // response used for accounts without administrative access.
    console.error("Unable to verify the administrative profile", profileError);
    redirect("/auth/unauthorized");
  }

  if (!profile || !profile.active || !isAdminRole(profile.role)) {
    redirect("/auth/unauthorized");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-300 bg-slate-900 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-semibold">Administración</p>
            {profile.full_name ? (
              <p className="truncate text-sm text-slate-200">
                {profile.full_name}
              </p>
            ) : null}
            <p className="truncate text-sm text-slate-300">{user.email}</p>
            <p className="text-xs text-slate-400">
              {ADMIN_ROLE_LABELS[profile.role]}
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
    </div>
  );
}
