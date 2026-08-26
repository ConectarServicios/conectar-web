import type { ReactNode } from "react";

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <p className="mx-auto max-w-5xl font-semibold text-slate-900">
          Conectar Servicios
        </p>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-6 py-16">
        {children}
      </main>
    </div>
  );
}
