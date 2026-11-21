import Link from "next/link";

export function ContentUnavailable({ backHref, backLabel }: Readonly<{ backHref: string; backLabel: string }>) {
  return <main className="public-container py-16">
    <h1 className="text-3xl font-black text-brand-navy-deep">Contenido no disponible temporalmente</h1>
    <p className="mt-4 text-slate-600" role="status">No pudimos consultar esta información. Intentá nuevamente más tarde.</p>
    <Link className="public-button-secondary mt-6" href={backHref}>{backLabel}</Link>
  </main>;
}
