import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";
import { getSiteUrl } from "@/lib/utils/site-url";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl() ?? undefined,
  title: {
    default: "Conectar Servicios",
    template: "%s | Conectar Servicios",
  },
  description: "Sitio web oficial de Conectar Servicios.",
};

export const viewport: Viewport = {
  themeColor: "#071a2f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${manrope.variable} ${sora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
