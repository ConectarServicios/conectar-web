import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { createClient } from "@/lib/supabase/server";
import { isAdminRole } from "@/types/admin";

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
    <div className="min-h-screen bg-slate-50">
      <div className="min-h-screen">
        <AdminHeader
          email={user.email ?? "Email no disponible"}
          fullName={profile.full_name}
          role={profile.role}
        />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
