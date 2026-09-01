"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function SetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (password !== confirmation) return setError("Las contraseñas no coinciden.");
    setPending(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) { setError("No pudimos guardar la contraseña. Solicitá una nueva invitación."); setPending(false); return; }
    await supabase.auth.signOut();
    router.replace("/auth/login?invitation=complete"); router.refresh();
  }
  return <form className="mt-8 space-y-5" onSubmit={submit}><label className="block text-sm font-medium">Contraseña<input autoComplete="new-password" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" disabled={pending} minLength={8} name="password" required type="password" /></label><label className="block text-sm font-medium">Repetir contraseña<input autoComplete="new-password" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" disabled={pending} minLength={8} name="confirmation" required type="password" /></label>{error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}<button className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-semibold text-white disabled:opacity-60" disabled={pending}>{pending ? "Guardando…" : "Guardar contraseña"}</button></form>;
}
