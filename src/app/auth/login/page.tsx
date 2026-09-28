import { redirect } from "next/navigation";
import Image from "next/image";

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
      className="mx-auto w-full max-w-md rounded-3xl border border-white/15 bg-white p-5 shadow-2xl shadow-black/25 min-[360px]:p-7 sm:p-9"
    >
      <div className="mb-7 flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#071A2F]"><Image alt="" height={34} priority src="/brand/conectar-isotipo.png" width={34} /></span>
        <div><p className="font-bold text-[#071A2F]">Conectar Servicios</p><p className="text-xs font-bold tracking-[0.16em] text-orange-700 uppercase">Administración</p></div>
      </div>
      <h1 id="login-title" className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        Acceso administrativo
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Ingresá con las credenciales asignadas a tu cuenta.
      </p>
      <LoginForm />
    </section>
  );
}
