import Link from "next/link";
import { FaqAccordion } from "@/components/public/faq-accordion";
import type { FaqItem } from "@/types/faqs";

export function FaqHomeSection({ items }: Readonly<{ items: FaqItem[] }>) {
  if (!items.length) return null;
  return <section className="bg-white py-20 sm:py-24">
    <div className="public-container grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
      <div><p className="public-eyebrow">Preguntas frecuentes</p><h2 className="public-heading mt-3">¿Tenés alguna duda?</h2><p className="mt-4 max-w-lg text-lg leading-8 text-slate-600">Encontrá respuestas rápidas a las consultas más habituales sobre nuestros servicios.</p><Link className="public-button-primary mt-7" href="/preguntas-frecuentes">Ver todas las preguntas frecuentes</Link></div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 shadow-sm sm:px-7"><FaqAccordion compact items={items}/></div>
    </div>
  </section>;
}
