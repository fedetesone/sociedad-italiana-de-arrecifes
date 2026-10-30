import { createClient } from "@sanity/client";
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2026-10-01",
      useCdn: false,
      perspective: "published",
    })
  : null;
