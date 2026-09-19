"use client";

import { useEffect } from "react";

export default function PublicError({ error, reset }: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => console.error("Public page render failed", error), [error]);
  return (
    <main className="bg-slate-50 py-20">
      <section className="public-container text-center" role="alert">
        <h1 className="text-3xl font-black text-brand-navy-deep">El contenido no está disponible temporalmente.</h1>
        <p className="mt-4 text-slate-600">Intentá nuevamente en unos minutos.</p>
        <button className="public-button-primary mt-8" onClick={reset} type="button">Reintentar</button>
      </section>
    </main>
  );
}
