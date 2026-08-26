import { redirect } from "next/navigation";

import { LoginForm } from "@/components/forms/login-form";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <section
      aria-labelledby="login-title"
      className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h1 id="login-title" className="text-2xl font-bold text-slate-950">
        Acceso administrativo
      </h1>
      <p className="mt-3 text-slate-600">
        Ingresá con las credenciales asignadas a tu cuenta.
      </p>
      <LoginForm />
    </section>
  );
}
