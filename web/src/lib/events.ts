export interface Event {
  _id: string;
  title: string;
  slug: string;
  startsAt: string;
  endsAt?: string;
  venue: string;
  summary: string;
  category?: string;
  image?: string;
  imageAlt?: string;
  body?: import("@portabletext/types").PortableTextBlock[];
  ticketUrl?: string;
}
export function splitEvents(events: Event[], now = new Date()) {
  const upcoming: Event[] = [],
    past: Event[] = [];
  for (const event of events) {
    const date = Date.parse(event.endsAt || event.startsAt);
    if (!Number.isFinite(date)) continue;
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
