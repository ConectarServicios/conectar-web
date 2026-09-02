"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useFormStatus } from "react-dom";

const CloseMenuContext = createContext<(() => void) | null>(null);

export function AdminActionsMenu({
  accessibleLabel,
  children,
}: Readonly<{
  accessibleLabel: string;
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-orange-500"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        Acciones <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <CloseMenuContext value={() => setOpen(false)}>
          <div
            aria-label={accessibleLabel}
            className="absolute left-0 z-30 mt-2 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl sm:right-0 sm:left-auto"
            id={menuId}
            role="menu"
          >
            {children}
          </div>
        </CloseMenuContext>
      )}
    </div>
  );
}

export function AdminMenuAction({
  action,
  children,
  confirmMessage,
  destructive = false,
  disabled = false,
  label,
  title,
}: Readonly<{
  action: NonNullable<React.ComponentProps<"form">["action"]>;
  children: React.ReactNode;
  confirmMessage?: string;
  destructive?: boolean;
  disabled?: boolean;
  label: string;
  title?: string;
}>) {
  const closeMenu = useContext(CloseMenuContext);

  return (
    <form
      action={action}
      className={destructive ? "mt-1 border-t border-slate-200 pt-1" : undefined}
      onSubmit={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
          return;
        }
        closeMenu?.();
      }}
      role="none"
    >
      {children}
      <MenuSubmitButton
        destructive={destructive}
        disabled={disabled}
        label={label}
        title={title}
      />
    </form>
  );
}

function MenuSubmitButton({
  destructive,
  disabled,
  label,
  title,
}: Readonly<{
  destructive: boolean;
  disabled: boolean;
  label: string;
  title?: string;
}>) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`w-full px-4 py-2.5 text-left font-semibold disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
        destructive
          ? "font-bold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600"
          : "text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-orange-500"
      }`}
      disabled={disabled || pending}
      role="menuitem"
      title={title}
      type="submit"
    >
      {pending ? "Actualizando…" : label}
    </button>
  );
}
