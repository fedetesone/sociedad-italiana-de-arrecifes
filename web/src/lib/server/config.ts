import { z } from "zod";
import type { ContactBindings } from "../../types/contact";

export const isTestKey = (value: string) => /^[123]x0{10,}/.test(value);
const address = z.email();
function validSender(value: string) {
  const mailbox = value.match(/^[^<>\r\n]+ <([^<>]+)>$/)?.[1] || value;
  return !/[\r\n]/.test(value) && address.safeParse(mailbox).success;
}
export function contactConfigured(
  env: ContactBindings,
  local: boolean,
  sitekey: string,
): boolean {
  if (!env.TURNSTILE_SECRET_KEY || !sitekey || !env.CONTACT_RATE_LIMITER)
    return false;
  if (!local && (isTestKey(env.TURNSTILE_SECRET_KEY) || isTestKey(sitekey)))
    return false;
  if (local && env.EMAIL_PROVIDER === "mock") return true;
  if (
    env.EMAIL_PROVIDER !== "resend" ||
    !env.RESEND_API_KEY ||
    !env.EMAIL_FROM ||
    !env.EMAIL_TO
  )
    return false;
  if (!validSender(env.EMAIL_FROM) || !address.safeParse(env.EMAIL_TO).success)
    return false;
  try {
    const origin = new URL(env.CONTACT_ORIGIN || "");
    return origin.protocol === "https:" && origin.origin === env.CONTACT_ORIGIN;
  } catch {
    return false;
  }
}
