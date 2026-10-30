import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { handleContact } from "../../lib/server/contact-handler";

export const prerender = false;
export const ALL: APIRoute = ({ request }) =>
  handleContact(request, env, {
    development: import.meta.env.DEV,
    sitekey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || "",
  });
