import { SetPasswordForm } from "@/components/forms/set-password-form";

export default function SetPasswordPage() {
  return (
    <section
      aria-labelledby="password-title"
      className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h1 id="password-title" className="text-2xl font-bold text-slate-950">
        Establecer contraseña
      </h1>
      <p className="mt-3 text-slate-600">
        Elegí una contraseña segura para completar tu invitación.
      </p>
      <SetPasswordForm />
    </section>
  );
}
