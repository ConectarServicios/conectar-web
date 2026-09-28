export function AdminPageHeader({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <header className="mb-6 sm:mb-8">
      <p className="mb-2 text-xs font-bold tracking-[0.18em] text-orange-700 uppercase">Administración</p>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base">{description}</p>
    </header>
  );
}
