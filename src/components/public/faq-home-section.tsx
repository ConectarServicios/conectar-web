import Link from "next/link";
import { FaqAccordion } from "@/components/public/faq-accordion";
import type { FaqItem } from "@/types/faqs";

export function FaqHomeSection({ items }: Readonly<{ items: FaqItem[] }>) {
  if (!items.length) return null;
  return (
    <section className="border-t border-home-border/80 bg-institutional-surface py-16 sm:py-20 lg:py-24">
      <div className="public-container grid gap-9 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-home-accent-strong sm:text-sm">
            Preguntas frecuentes
          </p>
          <h2 className="public-heading mt-3">¿Tenés alguna duda?</h2>
          <p className="mt-4 max-w-lg text-lg leading-8 text-slate-600">
            Encontrá respuestas rápidas a las consultas más habituales sobre
            nuestros servicios.
          </p>
          <Link
            className="public-button-primary mt-7"
            href="/preguntas-frecuentes"
          >
            Ver todas las preguntas frecuentes
          </Link>
        </div>
        <div className="self-start">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
