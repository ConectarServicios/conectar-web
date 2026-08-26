"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError("No pudimos cerrar la sesión. Intentá nuevamente.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/auth/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        className="rounded-md border border-slate-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        onClick={handleLogout}
        type="button"
      >
        {isSubmitting ? "Cerrando sesión…" : "Cerrar sesión"}
      </button>
      {error ? (
        <p aria-live="polite" className="text-xs text-red-200" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
