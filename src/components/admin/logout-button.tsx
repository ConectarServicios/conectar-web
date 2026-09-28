"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type LogoutButtonProps = Readonly<{
  variant?: "dark" | "light";
}>;

export function LogoutButton({ variant = "dark" }: LogoutButtonProps) {
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
        aria-label={isSubmitting ? "Cerrando sesión" : "Cerrar sesión"}
        className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
          variant === "light"
            ? "bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-slate-900"
            : "border border-slate-500 text-white hover:bg-slate-800 focus-visible:outline-white"
        }`}
        disabled={isSubmitting}
        onClick={handleLogout}
        type="button"
      >
        <LogOut aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">{isSubmitting ? "Cerrando…" : "Salir"}</span>
      </button>
      {error ? (
        <p
          aria-live="polite"
          className={`text-xs ${variant === "light" ? "text-red-700" : "text-red-200"}`}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
