import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Acceso",
  robots: { index: false, follow: false },
};

type AuthLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071A2F] px-4 py-8 sm:px-6 sm:py-12">
      <div aria-hidden="true" className="absolute -top-32 -right-24 size-80 rounded-full bg-orange-500/15 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-40 -left-24 size-96 rounded-full bg-[#F4C95D]/10 blur-3xl" />
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}
