"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

const authenticationError =
  "No pudimos iniciar sesión. Revisá el email y la contraseña e intentá nuevamente.";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(authenticationError);
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          className="block text-sm font-medium text-slate-800"
          htmlFor="email"
        >
          Email
        </label>
        <input
          autoComplete="email"
          autoFocus
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
          disabled={isSubmitting}
          id="email"
          name="email"
          required
          type="email"
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium text-slate-800"
          htmlFor="password"
        >
          Contraseña
        </label>
        <input
          autoComplete="current-password"
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
          disabled={isSubmitting}
          id="password"
          minLength={1}
          name="password"
          required
          type="password"
        />
      </div>

      {error ? (
        <p
          aria-live="polite"
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
