import type { Metadata } from "next";

import { EventCard } from "@/components/public/event-card";
import { eventImageUrl, getPublicEvents } from "@/lib/supabase/events";
import { createClient } from "@/lib/supabase/server";
import { eventTemporalStatus } from "@/lib/utils/event-dates";

export const metadata: Metadata = {
  title: "Eventos | Conectar Servicios",
  description: "Agenda de encuentros, actividades y eventos de Conectar Servicios.",
};

export default async function EventsPage() {
  const events = await getPublicEvents();
  const upcoming = events.filter((event) =>
    ["upcoming", "ongoing"].includes(eventTemporalStatus(event)),
  );
  const unscheduled = events.filter(
    (event) => eventTemporalStatus(event) === "unscheduled",
  );
  const past = events.filter((event) => eventTemporalStatus(event) === "finished");
  const supabase = await createClient();
  const images = Object.fromEntries(
    events.map((event) => [event.id, eventImageUrl(supabase, event.image_path)]),
  );

  return (
    <main className="bg-slate-50 py-14 sm:py-20">
      <div className="public-container">
        <header className="max-w-3xl">
          <p className="public-eyebrow">Agenda</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Eventos
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Conocé nuestras próximas actividades y recorré los encuentros anteriores.
          </p>
        </header>

        {!events.length ? (
          <section className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-2xl font-black">Próximamente habrá novedades</h2>
            <p className="mt-3 text-slate-600">
              Estamos preparando nuevas actividades para compartir con la comunidad.
            </p>
          </section>
        ) : (
          <>
            {upcoming.length > 0 && (
              <EventSection images={images} items={upcoming} title="Próximos eventos" />
            )}
            {unscheduled.length > 0 && (
              <EventSection
                className="border-t border-slate-200 pt-10"
                images={images}
                items={unscheduled}
                subtle
                title="Eventos sin fecha definida"
              />
            )}
            {past.length > 0 && (
              <EventSection
                className={
                  upcoming.length || unscheduled.length
                    ? "border-t border-slate-200 pt-14"
                    : undefined
                }
                images={images}
                items={past}
                spacious
                subtle
                title="Eventos anteriores"
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

function EventSection({
  className = "",
  images,
  items,
  spacious = false,
  subtle = false,
  title,
}: Readonly<{
  className?: string;
  images: Record<string, string | null>;
  items: Awaited<ReturnType<typeof getPublicEvents>>;
  spacious?: boolean;
  subtle?: boolean;
  title: string;
}>) {
  return (
    <section className={`${spacious ? "mt-20" : "mt-14"} ${className}`}>
      <h2 className={`text-2xl font-black ${subtle ? "text-slate-800" : "text-slate-950"}`}>
        {title}
      </h2>
      <div className="mt-7 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {items.map((event) => (
          <EventCard
            imageUrl={images[event.id]}
            item={event}
            key={event.id}
            subtle={subtle}
          />
        ))}
      </div>
    </section>
  );
}
