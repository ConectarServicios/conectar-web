import type { Metadata } from "next";
import { FaqsExplorer } from "@/components/public/faqs-explorer";
import { getPlayFaqs } from "@/lib/supabase/conectar-play";
import { getPublicFaqs } from "@/lib/supabase/faqs";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | Conectar Servicios",
  description:
    "Respuestas a consultas habituales sobre Internet, Wi-Fi, facturación, soporte y servicios de Conectar.",
};

export default async function FaqsPage() {
  const [faqs, playResult] = await Promise.all([
    getPublicFaqs(),
    getPlayFaqs(),
  ]);
  const hasFaqs = faqs.length > 0 || playResult.data.length > 0;
  return (
    <main className="bg-slate-50 py-14 sm:py-20">
      <div className="public-container">
        <header className="max-w-3xl">
          <p className="public-eyebrow">Ayuda</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Preguntas frecuentes
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Resolvé rápidamente tus consultas sobre Internet, Wi-Fi,
            facturación, instalación y los servicios de Conectar.
          </p>
        </header>
        {hasFaqs ? (
          <FaqsExplorer faqs={faqs} playFaqs={playResult.data} />
        ) : (
          <section className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center sm:p-12">
            <h2 className="text-2xl font-black">
              Estamos preparando nuevas respuestas
            </h2>
            <p className="mt-3 text-slate-600">
              Próximamente vas a encontrar aquí información para resolver tus
              consultas.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
