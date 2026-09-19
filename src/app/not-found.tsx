import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-navy-deep px-6 py-20 text-white">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl sm:p-12">
        <p className="text-sm font-black uppercase tracking-[.2em] text-orange-400">Error 404</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Página no encontrada</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-300">La dirección que ingresaste no existe o ya no está disponible.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="public-button-primary" href="/hogar">Ir a Hogar</Link>
          <Link className="public-button-secondary-dark" href="/servicios">Ver servicios</Link>
        </div>
      </section>
    </main>
  );
}
