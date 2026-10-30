import { z } from "zod";
import type { Event } from "../../types/event";
export function splitEvents(events: Event[], now = new Date()) {
  const upcoming: Event[] = [],
    past: Event[] = [];
  for (const event of events) {
    if (!isValidEvent(event) || event.status === "cancelled") continue;
    const date = Date.parse(event.endsAt || event.startsAt);
    (date >= now.getTime() ? upcoming : past).push(event);
  }
  return {
    upcoming: upcoming.sort(
      (a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt),
    ),
    past: past.sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt)),
  };
}
export const eventDate = (date: string) =>
  new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
export const eventTime = (date: string) =>
  new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
export function safeUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

// Require an absolute timestamp; reject ambiguous dates and inconsistent intervals.
export function isValidEvent(event: Event): boolean {
  const timestamp = (value: string) =>
    z.iso.datetime({ offset: true }).safeParse(value).success;
  return Boolean(
    event &&
    typeof event.slug === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.slug) &&
    typeof event.startsAt === "string" &&
    timestamp(event.startsAt) &&
    (!event.endsAt ||
      (timestamp(event.endsAt) &&
        Date.parse(event.endsAt) >= Date.parse(event.startsAt))) &&
    (!event.status || ["scheduled", "cancelled"].includes(event.status)),
  );
}
