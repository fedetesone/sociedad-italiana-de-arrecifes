import { sanityClient } from "./client";
import { contentQuery } from "./queries";
import type { Board, School, Settings } from "../../types/content";
import type { Event } from "../../types/event";

/**
 * CMS errors propagate so a build never replaces published content with empty data.
 * Without a project ID (dev, or ALLOW_MISSING_BUILD_CONFIG builds) there is no CMS to read.
 */
export async function fetchSanityContent() {
  if (!sanityClient) return null;
  return sanityClient.fetch<{
    settings: Partial<Settings> | null;
    school: Partial<School> | null;
    board: Partial<Board> | null;
    events: Event[];
  }>(contentQuery);
}
