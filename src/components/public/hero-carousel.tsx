"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { PublicHeroSlide } from "@/components/public/hero-section";

export function HeroCarousel({ slides }: Readonly<{ slides: PublicHeroSlide[] }>) {
  const [current, setCurrent] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);
  const touchStart = useRef<number | null>(null);
  const select = useCallback((index: number, interacted = true) => {
    setCurrent((index + slides.length) % slides.length);
    if (interacted) setPausedUntil(Date.now() + 12000);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => { if (Date.now() >= pausedUntil) setCurrent((value) => (value + 1) % slides.length); }, 6000);
    return () => window.clearInterval(timer);
  }, [pausedUntil, slides.length]);

  return <section aria-label="Presentación principal" aria-roledescription="carrusel" className="relative isolate min-h-[650px] scroll-mt-20 overflow-hidden bg-[#071a2f] text-white" id="inicio" onKeyDown={(event) => { if (event.key === "ArrowLeft") select(current - 1); if (event.key === "ArrowRight") select(current + 1); }} onTouchEnd={(event) => { if (touchStart.current === null) return; const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 45) select(current + (distance < 0 ? 1 : -1)); touchStart.current = null; }} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} tabIndex={0}>
    {slides.map((slide, index) => <article aria-hidden={index !== current} aria-label={`${index + 1} de ${slides.length}`} aria-roledescription="slide" className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${index === current ? "z-0 opacity-100" : "-z-10 opacity-0"}`} key={slide.id}>
      <Image alt="" className="object-cover" fill priority={index === 0} sizes="100vw" src={slide.imageUrl} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071a2f]/95 via-[#071a2f]/75 to-[#071a2f]/35" />
      <div className="public-container relative flex min-h-[650px] items-center py-24">
        <div className={`max-w-3xl ${index === 0 ? "lg:max-w-4xl" : ""}`}>
          {slide.featured && <p className="mb-5 inline-flex rounded-full border border-orange-400/40 bg-orange-400/15 px-4 py-2 text-sm font-bold text-orange-300">Conectar Servicios</p>}
          <h1 className={`font-black leading-[1.08] tracking-tight text-balance ${index === 0 ? "text-4xl sm:text-6xl lg:text-7xl" : "text-4xl sm:text-5xl lg:text-6xl"}`}>{slide.title}</h1>
          {slide.subtitle && <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">{slide.subtitle}</p>}
          {slide.buttonText && slide.buttonUrl && <a className="public-button-primary mt-9 inline-flex" href={slide.buttonUrl} rel={slide.external ? "noopener noreferrer" : undefined} target={slide.external ? "_blank" : undefined}>{slide.buttonText}<span aria-hidden="true">→</span></a>}
        </div>
      </div>
    </article>)}
    {slides.length > 1 && <><button aria-label="Slide anterior" className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-slate-950/45 text-2xl backdrop-blur hover:bg-slate-950/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 sm:left-6" onClick={() => select(current - 1)} type="button">‹</button><button aria-label="Slide siguiente" className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-slate-950/45 text-2xl backdrop-blur hover:bg-slate-950/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 sm:right-6" onClick={() => select(current + 1)} type="button">›</button><div aria-label="Elegir slide" className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2" role="group">{slides.map((slide, index) => <button aria-label={`Mostrar slide ${index + 1}: ${slide.title}`} aria-pressed={index === current} className={`h-2.5 rounded-full transition-all motion-reduce:transition-none ${index === current ? "w-8 bg-orange-400" : "w-2.5 bg-white/60 hover:bg-white"}`} key={slide.id} onClick={() => select(index)} type="button" />)}</div></>}
    <p aria-live="polite" className="sr-only">Slide {current + 1} de {slides.length}: {slides[current].title}</p>
  </section>;
}
