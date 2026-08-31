"use client";

import { useActionState, type ReactNode } from "react";

import type { SettingsActionState } from "@/types/site-settings";

type SettingsAction = (
  state: SettingsActionState,
  formData: FormData,
) => Promise<SettingsActionState>;

type SettingsFormProps = Readonly<{
  action: SettingsAction;
  children: (fieldErrors: Record<string, string>) => ReactNode;
}>;

const initialState: SettingsActionState = {};

export function SettingsForm({ action, children }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-5">
      {children(state.fieldErrors ?? {})}
      {state.message && (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role={state.success ? "status" : "alert"}
        >
          {state.message}
        </p>
      )}
      <button
        className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}

export const settingsFieldClassName =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200";

export function FieldError({ children }: Readonly<{ children?: string }>) {
  if (!children) return null;
  return <span className="mt-1 block text-xs font-normal text-red-700">{children}</span>;
}
