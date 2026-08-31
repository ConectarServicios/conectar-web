import Link from "next/link";

import { EventCard } from "@/components/public/event-card";
import type { EventItem } from "@/types/events";

export function EventsHomeSection({
  items,
  imageUrls,
}: Readonly<{ items: EventItem[]; imageUrls: Record<string, string | null> }>) {
  if (!items.length) return null;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="public-container">
        <p className="public-eyebrow">Agenda</p>
        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="public-heading">Próximos eventos</h2>
            <p className="mt-3 text-lg text-slate-600">
              Encuentros y actividades de Conectar Servicios.
            </p>
          </div>
          <Link className="public-button-primary" href="/eventos">
            Ver todos los eventos
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <EventCard imageUrl={imageUrls[item.id]} item={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
