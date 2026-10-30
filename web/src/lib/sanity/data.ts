import { sanityClient } from "./client";
import { contentQuery } from "./queries";
import type { Settings } from "../../types/content";
import type { Event } from "../../types/event";

/** Throw on CMS failure so a build never replaces published content with empty data. */
export async function fetchSanityContent() {
  if (!sanityClient) return null;
  return sanityClient.fetch<{
    settings: Partial<Settings> | null;
    events: Event[];
  }>(contentQuery);
}
