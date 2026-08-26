import { LogoutButton } from "@/components/admin/logout-button";

export default function UnauthorizedPage() {
  return (
    <section
      aria-labelledby="unauthorized-title"
      className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm"
    >
      <h1
        id="unauthorized-title"
        className="text-2xl font-bold text-slate-950"
      >
        Acceso no autorizado
      </h1>
      <p className="mt-3 text-slate-600">
        Tu cuenta no tiene permisos administrativos activos. Si creés que se
        trata de un error, contactá a un administrador.
      </p>
      <div className="mt-8 flex justify-center">
        <LogoutButton variant="light" />
      </div>
    </section>
  );
}
