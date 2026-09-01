"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createInvitationClient } from "@/lib/supabase/invitation-client";

const invalidInvitationMessage =
  "La invitación no es válida o venció. Solicitá una nueva invitación.";

type InvitationState = "checking" | "invalid" | "valid";

export function SetPasswordForm() {
  const router = useRouter();
  const invitationClient = useRef<SupabaseClient | null>(null);
  const [invitationState, setInvitationState] =
    useState<InvitationState>("checking");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function consumeInvitation() {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      const hasInvitationGrant =
        fragment.get("type") === "invite" &&
        Boolean(fragment.get("access_token")) &&
        Boolean(fragment.get("refresh_token"));

      if (!hasInvitationGrant) {
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
        setInvitationState("invalid");
        return;
      }

      let supabase: SupabaseClient;
      try {
        supabase = createInvitationClient();
      } catch {
        window.history.replaceState(null, "", window.location.pathname);
        setInvitationState("invalid");
        return;
      }
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (cancelled) return;

      // Remove credentials from browser history as soon as they are consumed.
      window.history.replaceState(null, "", window.location.pathname);

      if (sessionError || !session) {
        await supabase.auth.signOut({ scope: "local" });
        setInvitationState("invalid");
        return;
      }

      invitationClient.current = supabase;
      setInvitationState("valid");
    }

    void consumeInvitation();
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const supabase = invitationClient.current;
    if (invitationState !== "valid" || !supabase) {
      setInvitationState("invalid");
      return;
    }

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setPending(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setInvitationState("invalid");
      setPending(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("No pudimos guardar la contraseña. Solicitá una nueva invitación.");
      setPending(false);
      return;
    }

    await supabase.auth.signOut({ scope: "local" });
    invitationClient.current = null;
    window.history.replaceState(null, "", window.location.pathname);
    router.replace("/auth/login?invitation=complete");
    router.refresh();
  }

  if (invitationState === "checking") {
    return (
      <p aria-live="polite" className="mt-6 text-sm text-slate-600">
        Verificando invitación…
      </p>
    );
  }

  if (invitationState === "invalid") {
    return (
      <p
        className="mt-6 rounded-md bg-red-50 p-3 text-sm text-red-700"
        role="alert"
      >
        {invalidInvitationMessage}
      </p>
    );
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={submit}>
      <label className="block text-sm font-medium">
        Contraseña
        <input
          autoComplete="new-password"
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
          disabled={pending}
          minLength={8}
          name="password"
          required
          type="password"
        />
      </label>
      <label className="block text-sm font-medium">
        Repetir contraseña
        <input
          autoComplete="new-password"
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
          disabled={pending}
          minLength={8}
          name="confirmation"
          required
          type="password"
        />
      </label>
      {error ? (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-semibold text-white disabled:opacity-60"
        disabled={pending}
      >
        {pending ? "Guardando…" : "Guardar contraseña"}
      </button>
    </form>
  );
}
