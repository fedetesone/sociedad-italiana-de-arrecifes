import { getContent } from "../content";
import { splitEvents } from "./utils";

/** Published Sanity content only. No fabricated events or runtime CMS reads. */
export async function getEvents() {
  return (await getContent()).events;
}
export async function getEventAgenda(now = new Date()) {
  return splitEvents(await getEvents(), now);
}
export async function getUpcomingEvents(limit = 3, now = new Date()) {
  return (await getEventAgenda(now)).upcoming.slice(0, limit);
}
