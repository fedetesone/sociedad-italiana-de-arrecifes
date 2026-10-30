import { z } from "zod";
import type { ContactBindings, ContactResponse } from "../../types/contact";
import { contactSchema } from "../validation/contact";
import { contactConfigured } from "./config";
import { verifyTurnstile } from "../security/turnstile";
import { sendContactEmail } from "../email/service";

const json = (body: ContactResponse, status: number, headers = {}) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
const error = (status: number, code: string, message: string, headers = {}) =>
  json({ ok: false, error: { code, message } }, status, headers);

// Bound the actual streamed body, not just the untrusted Content-Length header.
async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 32768) {
      await reader.cancel();
      throw new RangeError("Body too large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(bytes);
}

/** HTTP orchestration shared by the Astro route and request/response tests. */
export async function handleContact(
  request: Request,
  env: ContactBindings,
  options: { development: boolean; sitekey: string },
  send: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== "POST")
    return error(
      405,
      "METHOD_NOT_ALLOWED",
      "Usá el formulario para enviar tu consulta.",
      { Allow: "POST" },
    );
  const url = new URL(request.url);
  const local =
    options.development &&
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (!contactConfigured(env, local, options.sitekey))
    return error(
      503,
      "NOT_CONFIGURED",
      "El formulario no está disponible por el momento. Escribinos por correo electrónico.",
    );
  const expectedOrigin = local ? url.origin : env.CONTACT_ORIGIN;
  if (
    request.headers.get("Origin") !== expectedOrigin ||
    url.origin !== expectedOrigin
  )
    return error(
      403,
      "INVALID_ORIGIN",
      "Enviá tu consulta desde el sitio de la institución.",
    );
  if (
    request.headers.get("Content-Type")?.split(";")[0].trim() !==
    "application/json"
  )
    return error(
      415,
      "UNSUPPORTED_MEDIA_TYPE",
      "El formato de la solicitud no es válido.",
    );
  try {
    const ip =
      request.headers.get("CF-Connecting-IP") || (local ? "local" : "");
    if (!ip)
      return error(
        403,
        "INVALID_REQUEST",
        "No pudimos verificar la solicitud.",
      );
    const { success } = await env.CONTACT_RATE_LIMITER!.limit({
      key: `contact:${ip}`,
    });
    if (!success)
      return error(
        429,
        "RATE_LIMITED",
        "Recibimos varias solicitudes. Esperá un minuto antes de intentar nuevamente.",
        { "Retry-After": "60" },
      );
  } catch {
    return error(
      503,
      "PROTECTION_UNAVAILABLE",
      "No pudimos verificar la solicitud. Intentá más tarde.",
    );
  }
  let input: unknown;
  try {
    input = JSON.parse(await readBody(request));
  } catch (cause) {
    return error(
      cause instanceof RangeError ? 413 : 400,
      "INVALID_BODY",
      "La solicitud es demasiado grande o tiene un formato inválido.",
    );
  }
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success)
    return json(
      {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Revisá los campos indicados.",
          fields: z.flattenError(parsed.error).fieldErrors,
        },
      },
      422,
    );
  try {
    if (
      !(await verifyTurnstile(
        parsed.data.turnstileToken,
        env.TURNSTILE_SECRET_KEY!,
        url.hostname,
        local,
        send,
      ))
    ) {
      return error(
        403,
        "TURNSTILE_FAILED",
        "No pudimos completar la verificación de seguridad. Intentá nuevamente.",
      );
    }
  } catch {
    return error(
      503,
      "PROTECTION_UNAVAILABLE",
      "La verificación de seguridad no está disponible. Intentá más tarde.",
    );
  }
  try {
    const status = await sendContactEmail(parsed.data, env, local, send);
    return json(
      {
        ok: true,
        status,
        message:
          status === "simulated"
            ? "Prueba local: el mensaje quedó registrado en la terminal. No se envió ningún correo."
            : "Tu consulta fue aceptada por el servicio de correo. Te responderemos al email que indicaste.",
      },
      status === "simulated" ? 200 : 202,
    );
  } catch {
    return error(
      502,
      "EMAIL_FAILED",
      "No pudimos confirmar el envío. Intentá más tarde o escribinos por correo electrónico.",
    );
  }
}
