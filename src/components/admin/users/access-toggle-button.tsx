"use client";

import { useFormStatus } from "react-dom";

export function AccessToggleButton({ active, disabled, name }: Readonly<{ active: boolean; disabled: boolean; name: string }>) {
  const { pending } = useFormStatus();
  return <button
    className="font-bold text-slate-600 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
    disabled={disabled || pending}
    onClick={(event) => {
      if (active && !window.confirm(`¿Desactivar el acceso de ${name}?`)) event.preventDefault();
    }}
    title={disabled ? "No podés desactivar tu propia cuenta" : undefined}
    type="submit"
  >{pending ? "Actualizando…" : active ? "Desactivar" : "Activar"}</button>;
}
