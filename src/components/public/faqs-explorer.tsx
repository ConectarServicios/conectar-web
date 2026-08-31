"use client";

import { useState } from "react";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { FAQ_FILTER_ORDER, type FaqItem } from "@/types/faqs";
import type { ConectarPlayFaq } from "@/types/conectar-play";

const ALL = "Todas";
const PLAY = "Conectar Play";

export function FaqsExplorer({ faqs, playFaqs }: Readonly<{ faqs: FaqItem[]; playFaqs: ConectarPlayFaq[] }>) {
  const [filter, setFilter] = useState(ALL);
  const categories = FAQ_FILTER_ORDER.filter((category) => faqs.some((faq) => faq.category === category));
  const filters = [ALL, ...categories, ...(playFaqs.length ? [PLAY] : [])];
  const visibleGeneral = filter === ALL ? faqs : faqs.filter((faq) => faq.category === filter);
  const showPlay = playFaqs.length > 0 && (filter === ALL || filter === PLAY);
  return <>
    <div aria-label="Filtrar preguntas por categoría" className="mt-10 flex max-w-full gap-2 overflow-x-auto pb-2" role="group">
      {filters.map((item) => <button aria-pressed={filter === item} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-orange-500 ${filter === item ? "border-orange-600 bg-orange-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-orange-400"}`} key={item} onClick={() => setFilter(item)} type="button">{item}</button>)}
    </div>
    <div className="mt-10 space-y-14">
      {visibleGeneral.length > 0 && <section aria-labelledby="general-faq-heading">
        <h2 className="text-2xl font-black text-slate-950" id="general-faq-heading">{filter === ALL ? "Consultas generales" : filter}</h2>
        <div className="mt-6"><FaqAccordion items={visibleGeneral}/></div>
      </section>}
      {showPlay && <section aria-labelledby="play-faq-heading" className={visibleGeneral.length ? "border-t border-slate-200 pt-12" : ""}>
        <p className="public-eyebrow">Entretenimiento</p><h2 className="mt-2 text-2xl font-black text-slate-950" id="play-faq-heading">Conectar Play</h2>
        <p className="mt-3 text-slate-600">Respuestas específicas sobre el servicio Conectar Play.</p>
        <div className="mt-6"><FaqAccordion items={playFaqs.map((faq) => ({ id: `play-${faq.id}`, question: faq.question, answer: faq.answer }))}/></div>
      </section>}
    </div>
  </>;
}
