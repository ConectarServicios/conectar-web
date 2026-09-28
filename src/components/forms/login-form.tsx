"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const authenticationError =
  "No pudimos iniciar sesión. Revisá el email y la contraseña e intentá nuevamente.";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          className="block text-sm font-medium text-slate-800"
          htmlFor="email"
        >
          Email
        </label>
        <div className="relative mt-2"><Mail aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" /><input
          autoComplete="email"
          autoFocus
          className="min-h-12 w-full rounded-xl border border-slate-300 py-2.5 pr-3 pl-10 text-slate-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-slate-100"
          disabled={isSubmitting}
          id="email"
          name="email"
          required
          type="email"
        /></div>
      </div>

      <div>
        <label
          className="block text-sm font-medium text-slate-800"
          htmlFor="password"
        >
          Contraseña
        </label>
        <div className="relative mt-2"><LockKeyhole aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" /><input
          autoComplete="current-password"
          className="min-h-12 w-full rounded-xl border border-slate-300 py-2.5 pr-12 pl-10 text-slate-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-slate-100"
          disabled={isSubmitting}
          id="password"
          minLength={1}
          name="password"
          required
          type={showPassword ? "text" : "password"}
        /><button aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPassword} className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-slate-500 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-orange-500" onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}</button></div>
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
        className="min-h-12 w-full rounded-xl bg-[#071A2F] px-4 py-2.5 font-semibold text-white transition hover:bg-[#1E3250] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
