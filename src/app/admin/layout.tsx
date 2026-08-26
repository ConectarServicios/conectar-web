import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/admin/logout-button";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-300 bg-slate-900 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-semibold">Administración</p>
            <p className="truncate text-sm text-slate-300">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
    </div>
  );
}
