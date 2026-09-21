"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { PlanCard } from "@/components/public/plan-card";
import type { Plan } from "@/types/plans";

type PlansCarouselProps = Readonly<{
  now: string;
  plans: Plan[];
}>;

export function PlansCarousel({ now, plans }: PlansCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentDate = new Date(now);

  const updateActivePlan = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel || window.matchMedia("(min-width: 48rem)").matches) return;

    const viewportCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    const cards = Array.from(carousel.children) as HTMLElement[];
    const closestIndex = cards.reduce((closest, card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const closestCard = cards[closest];
      const closestCenter = closestCard.offsetLeft + closestCard.offsetWidth / 2;

      return Math.abs(cardCenter - viewportCenter) < Math.abs(closestCenter - viewportCenter)
        ? index
        : closest;
    }, 0);

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    updateActivePlan();
    const resizeObserver = new ResizeObserver(updateActivePlan);
    resizeObserver.observe(carousel);
    carousel.addEventListener("scroll", updateActivePlan, { passive: true });

    return () => {
      resizeObserver.disconnect();
      carousel.removeEventListener("scroll", updateActivePlan);
    };
  }, [updateActivePlan]);

  const goToPlan = (index: number) => {
    const carousel = carouselRef.current;
    const card = carousel?.children.item(index) as HTMLElement | null;
    if (!carousel || !card) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    carousel.scrollTo({
      behavior: reduceMotion ? "instant" : "smooth",
      left: card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2,
    });
    setActiveIndex(index);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    goToPlan(Math.min(Math.max(activeIndex + direction, 0), plans.length - 1));
  };

  return (
    <div className="mt-12">
      <div
        aria-label="Planes de Internet"
        className="-mx-5 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4 xl:gap-7"
        onKeyDown={handleKeyDown}
        ref={carouselRef}
        role="region"
        tabIndex={0}
      >
        {plans.map((plan, index) => (
          <div
            aria-label={`${index + 1} de ${plans.length}: ${plan.name}`}
            className="w-[calc(100%-2.5rem)] shrink-0 snap-center md:w-auto"
            key={plan.id}
            role="group"
          >
            <PlanCard now={currentDate} plan={plan} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 md:hidden">
        <button
          aria-label="Ver plan anterior"
          className="grid size-9 place-items-center rounded-full border border-home-border bg-white text-brand-navy-deep transition hover:border-home-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-accent disabled:cursor-not-allowed disabled:opacity-40"
          disabled={activeIndex === 0}
          onClick={() => goToPlan(activeIndex - 1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={18} />
        </button>

        <div className="flex items-center gap-2" aria-label="Elegir plan">
          {plans.map((plan, index) => (
            <button
              aria-label={`Ver ${plan.name}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={`size-2.5 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-accent ${
                activeIndex === index ? "bg-home-accent-strong" : "bg-slate-300 hover:bg-slate-400"
              }`}
              key={plan.id}
              onClick={() => goToPlan(index)}
              type="button"
            />
          ))}
        </div>

        <button
          aria-label="Ver plan siguiente"
          className="grid size-9 place-items-center rounded-full border border-home-border bg-white text-brand-navy-deep transition hover:border-home-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-accent disabled:cursor-not-allowed disabled:opacity-40"
          disabled={activeIndex === plans.length - 1}
          onClick={() => goToPlan(activeIndex + 1)}
          type="button"
        >
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Plan {activeIndex + 1} de {plans.length}
      </p>
    </div>
  );
}
