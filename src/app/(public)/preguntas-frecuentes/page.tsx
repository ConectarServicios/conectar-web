import type { Metadata } from "next";
import { FaqsExplorer } from "@/components/public/faqs-explorer";
import { getPlayFaqs } from "@/lib/supabase/conectar-play";
import { getPublicFaqs } from "@/lib/supabase/faqs";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | Conectar Servicios",
  description:
    "Respuestas a consultas habituales sobre Internet, Wi-Fi, facturación, soporte y servicios de Conectar.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

export default async function FaqsPage() {
  const [faqsResult, playResult] = await Promise.all([
    getPublicFaqs(),
    getPlayFaqs(),
  ]);
  const hasFaqs = faqsResult.data.length > 0 || playResult.data.length > 0;
  const unavailable = faqsResult.unavailable || playResult.unavailable;
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
          <><FaqsExplorer faqs={faqsResult.data} playFaqs={playResult.data} />
          {unavailable && <p className="public-empty-state" role="status">Parte de las preguntas frecuentes no está disponible temporalmente.</p>}</>
        ) : unavailable ? (
          <section className="public-empty-state mt-12" role="status">
            <h2 className="text-2xl font-black">Las preguntas frecuentes no están disponibles temporalmente.</h2>
            <p className="mt-3 text-slate-600">Intentá nuevamente más tarde.</p>
          </section>
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
