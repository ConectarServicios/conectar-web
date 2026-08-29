export const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";

const dateTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: ARGENTINA_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

function dateTimeParts(date: Date) {
  return Object.fromEntries(dateTimeFormatter.formatToParts(date)
    .filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
}

/** Formats an instant as the wall-clock value required by an Argentina datetime-local input. */
export function formatArgentinaDateTimeLocal(isoDate: string | null) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  const parts = dateTimeParts(date);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/** Interprets a timezone-less input in Buenos Aires, regardless of the runtime timezone. */
export function parseArgentinaDateTimeLocal(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  const wallClockAsUtc = Date.UTC(+year, +month - 1, +day, +hour, +minute);
  const candidate = new Date(wallClockAsUtc);
  if (candidate.getUTCFullYear() !== +year || candidate.getUTCMonth() !== +month - 1 ||
      candidate.getUTCDate() !== +day || candidate.getUTCHours() !== +hour ||
      candidate.getUTCMinutes() !== +minute) return null;

  // Intl supplies the business-zone offset. Two passes keep this correct even
  // if a timezone changes offset close to the requested wall-clock value.
  let instant = wallClockAsUtc;
  for (let pass = 0; pass < 2; pass += 1) {
    const parts = dateTimeParts(new Date(instant));
    const renderedAsUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
    instant += wallClockAsUtc - renderedAsUtc;
  }
  const isoDate = new Date(instant).toISOString();
  return formatArgentinaDateTimeLocal(isoDate) === value ? isoDate : null;
}

export const argentinaDateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "long", timeZone: ARGENTINA_TIME_ZONE,
});

export const argentinaAdminDateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium", timeStyle: "short", timeZone: ARGENTINA_TIME_ZONE,
});
