export function AdminPageHeader({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <header className="mb-8">
      <p className="mb-2 text-xs font-bold tracking-[0.18em] text-orange-700 uppercase">Administración</p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
    </header>
  );
}
