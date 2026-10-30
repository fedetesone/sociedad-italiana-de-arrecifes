import type { ContactBindings, ContactMessage } from "../../types/contact";

const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );

/** Only this module knows the email provider. No recipients come from request data. */
export async function sendContactEmail(
  contact: ContactMessage,
  env: ContactBindings,
  local: boolean,
  send: typeof fetch = fetch,
): Promise<"accepted" | "simulated"> {
  const text = `Nueva consulta desde la web\n\nNombre: ${contact.name}\nEmail: ${contact.email}\nAsunto: ${contact.subject}\n\n${contact.message}`;
  if (env.EMAIL_PROVIDER === "mock" && local) {
    console.info("[EMAIL LOCAL — NO ENVIADO]\n" + text);
    return "simulated";
  }
  if (
    env.EMAIL_PROVIDER !== "resend" ||
    !env.RESEND_API_KEY ||
    !env.EMAIL_FROM ||
    !env.EMAIL_TO
  ) {
    throw new Error("Email not configured");
  }
  const response = await send("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [env.EMAIL_TO],
      reply_to: contact.email,
      subject: `[Voz de Caprera] ${contact.subject}`,
      text,
      html: `<div style="font-family:Arial,sans-serif;color:#254e3f;max-width:640px"><h1 style="font-size:24px">Nueva consulta</h1><p><strong>Nombre:</strong> ${escapeHtml(contact.name)}<br><strong>Email:</strong> ${escapeHtml(contact.email)}</p><h2 style="font-size:18px">${escapeHtml(contact.subject)}</h2><p style="white-space:pre-wrap;color:#222">${escapeHtml(contact.message)}</p><hr><p>Sociedad Italiana de S.M. “Voz de Caprera” · Arrecifes</p></div>`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Email provider rejected request");
  const result = (await response.json()) as { id?: string };
  if (!result.id) throw new Error("Email provider did not acknowledge request");
  // Acceptance is not a claim of final inbox delivery.
  return "accepted";
}
