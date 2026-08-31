"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { saveEvent } from "@/app/admin/events/actions";
import { formatArgentinaDateTimeLocal } from "@/lib/utils/news-dates";
import { normalizeEventSlug } from "@/lib/validations/events";
import type { EventActionState, EventFormValues } from "@/types/events";

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 shadow-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200";
const fieldsetClass = "rounded-2xl border bg-white p-6 shadow-sm";

export function EventForm({
  id,
  initialValues,
}: Readonly<{ id?: string; initialValues?: EventFormValues }>) {
  const [state, action, pending] = useActionState(saveEvent, {} as EventActionState);
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [manualSlug, setManualSlug] = useState(Boolean(id));
  const error = (key: string) => state.fieldErrors?.[key];

  return (
    <form action={action} className="space-y-6">
      {id && <input name="id" type="hidden" value={id} />}
      {state.message && (
        <p
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          role="alert"
        >
          {state.message}
        </p>
      )}

      <fieldset className={fieldsetClass}>
        <legend className="px-2 text-lg font-bold">Contenido</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold sm:col-span-2">
            Título *
            <input
              className={inputClass}
              defaultValue={initialValues?.title}
              name="title"
              onChange={(event) => {
                if (!manualSlug) setSlug(normalizeEventSlug(event.target.value));
              }}
              required
            />
            <FieldError message={error("title")} />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Slug *
            <input
              className={inputClass}
              name="slug"
              onChange={(event) => {
                setManualSlug(true);
                setSlug(normalizeEventSlug(event.target.value));
              }}
              required
              value={slug}
            />
            <small className="block text-slate-500">/eventos/{slug || "slug"}</small>
            <FieldError message={error("slug")} />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Resumen *
            <textarea
              className={`${inputClass} min-h-24`}
              defaultValue={initialValues?.summary}
              name="summary"
              required
            />
            <FieldError message={error("summary")} />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Descripción completa *
            <textarea
              className={`${inputClass} min-h-56`}
              defaultValue={initialValues?.description}
              name="description"
              required
            />
            <FieldError message={error("description")} />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Imagen JPG, PNG o WebP (máximo 5 MB)
            <input
              accept="image/jpeg,image/png,image/webp"
              className={inputClass}
              name="image"
              type="file"
            />
            <FieldError message={error("image")} />
          </label>
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className="px-2 text-lg font-bold">Ubicación</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Lugar
            <input
              className={inputClass}
              defaultValue={initialValues?.location ?? ""}
              name="location"
            />
          </label>
          <label className="text-sm font-semibold">
            Dirección
            <input
              className={inputClass}
              defaultValue={initialValues?.address ?? ""}
              name="address"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className="px-2 text-lg font-bold">Fecha y hora</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Inicio *
            <input
              className={inputClass}
              defaultValue={formatArgentinaDateTimeLocal(initialValues?.starts_at ?? null)}
              name="starts_at"
              required
              type="datetime-local"
            />
            <FieldError message={error("starts_at")} />
          </label>
          <label className="text-sm font-semibold">
            Finalización opcional
            <input
              className={inputClass}
              defaultValue={formatArgentinaDateTimeLocal(initialValues?.ends_at ?? null)}
              name="ends_at"
              type="datetime-local"
            />
            <FieldError message={error("ends_at")} />
          </label>
        </div>
        <small className="mt-3 block text-slate-500">
          Horario de Argentina (Buenos Aires).
        </small>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className="px-2 text-lg font-bold">Publicación</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Estado
            <select
              className={inputClass}
              defaultValue={initialValues?.status ?? "draft"}
              name="status"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </label>
          <label className="flex items-center gap-3 pt-7 text-sm font-semibold">
            <input
              className="size-5 accent-orange-600"
              defaultChecked={initialValues?.featured}
              name="featured"
              type="checkbox"
            />
            Destacado
          </label>
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className="px-2 text-lg font-bold">CTA opcional</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Texto del botón
            <input
              className={inputClass}
              defaultValue={initialValues?.button_text ?? ""}
              name="button_text"
            />
            <FieldError message={error("button_text")} />
          </label>
          <label className="text-sm font-semibold">
            URL del botón
            <input
              className={inputClass}
              defaultValue={initialValues?.button_url ?? ""}
              name="button_url"
              placeholder="/contacto o https://..."
            />
            <FieldError message={error("button_url")} />
          </label>
        </div>
      </fieldset>

      <div className="flex justify-end gap-3">
        <Link className="rounded-xl border px-5 py-2.5 font-bold" href="/admin/events">
          Cancelar
        </Link>
        <button
          className="rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white disabled:opacity-60"
          disabled={pending}
        >
          {pending ? "Guardando…" : "Guardar evento"}
        </button>
      </div>
    </form>
  );
}

function FieldError({ message }: Readonly<{ message?: string }>) {
  return message ? <span className="block text-xs text-red-700">{message}</span> : null;
}
