import { z } from "zod";
import type { ContactBindings } from "../../types/contact";

export const isTestKey = (value: string) => /^[123]x0{10,}/.test(value);
const address = z.email();
function validSender(value: string) {
  const mailbox = value.match(/^[^<>\r\n]+ <([^<>]+)>$/)?.[1] || value;
  return !/[\r\n]/.test(value) && address.safeParse(mailbox).success;
}
/** First missing or invalid setting, named without its value; undefined when ready. */
export function contactConfigProblem(
  env: ContactBindings,
  local: boolean,
  sitekey: string,
): string | undefined {
  if (!env.TURNSTILE_SECRET_KEY) return "TURNSTILE_SECRET_KEY missing";
  if (!sitekey) return "PUBLIC_TURNSTILE_SITE_KEY missing at build";
  if (!env.CONTACT_RATE_LIMITER) return "CONTACT_RATE_LIMITER binding missing";
  if (!local && (isTestKey(env.TURNSTILE_SECRET_KEY) || isTestKey(sitekey)))
    return "Turnstile test key outside astro dev";
  if (local && env.EMAIL_PROVIDER === "mock") return;
  if (env.EMAIL_PROVIDER !== "resend") return "EMAIL_PROVIDER is not resend";
  if (!env.RESEND_API_KEY) return "RESEND_API_KEY missing";
  if (!env.EMAIL_FROM || !validSender(env.EMAIL_FROM))
    return "EMAIL_FROM missing or invalid";
  if (!env.EMAIL_TO || !address.safeParse(env.EMAIL_TO).success)
    return "EMAIL_TO missing or invalid";
  try {
    const origin = new URL(env.CONTACT_ORIGIN || "");
    if (origin.protocol === "https:" && origin.origin === env.CONTACT_ORIGIN)
      return;
  } catch {}
  return "CONTACT_ORIGIN must be an https origin without path or trailing slash";
}
