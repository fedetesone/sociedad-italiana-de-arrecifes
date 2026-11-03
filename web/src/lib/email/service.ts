import type {
  ContactBindings,
  ContactInput,
  FormKind,
} from "../../types/contact";

const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );

// Form names as shown in the site navigation; used as the subject tag.
const formNames: Record<FormKind, string> = {
  contacto: "Contacto",
  alta: "Solicitud de alta",
  baja: "Solicitud de baja",
  escuela: "Escuela de italiano",
  salones: "Alquiler de salones",
  deudas: "Regularización de deudas",
  panteones: "Panteones",
  ciudadania: "Ciudadanía italiana",
};
// Order of rows in the email. Empty optional fields are omitted.
const labels = {
  name: "Nombre",
  email: "Email",
  phone: "Teléfono",
  memberNumber: "Número de socio",
  address: "Domicilio",
  city: "Localidad",
  postalCode: "Código postal",
  experience: "Experiencia en italiano",
  level: "Nivel de interés",
  room: "Espacio",
  date: "Fecha tentativa",
  guests: "Cantidad de personas",
  memberStatus: "¿Es socio/a?",
};

/** Only this module knows the email provider. No recipients come from request data. */
export async function sendContactEmail(
  contact: ContactInput,
  env: ContactBindings,
  local: boolean,
  send: typeof fetch = fetch,
): Promise<"accepted" | "simulated"> {
  const topic =
    contact.kind === "contacto" ? contact.subject : formNames[contact.kind];
  // "[Contacto] <asunto>" or "[Solicitud de alta] <nombre>".
  const subject = `[${formNames[contact.kind]}] ${contact.kind === "contacto" ? contact.subject : contact.name}`;
  const values = contact as Partial<Record<keyof typeof labels, string>>;
  const rows = Object.entries(labels).flatMap(([key, label]) => {
    const value = values[key as keyof typeof labels];
    if (!value) return [];
    // Dates arrive as validated YYYY-MM-DD; show them as DD/MM/YYYY.
    return [
      [label, key === "date" ? value.split("-").reverse().join("/") : value],
    ] as const;
  });
  const message = contact.message || "";
  const text =
    `Nueva consulta desde la web\n\n${topic}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${message}`.trimEnd();
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
      subject,
      text,
      html: `<div style="font-family:Arial,sans-serif;color:#254e3f;max-width:640px"><h1 style="font-size:24px">Nueva consulta</h1><h2 style="font-size:18px">${escapeHtml(topic)}</h2><p>${rows.map(([label, value]) => `<strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}`).join("<br>")}</p>${message ? `<p style="white-space:pre-wrap;color:#222">${escapeHtml(message)}</p>` : ""}<hr><p>Sociedad Italiana de S.M. “Voz de Caprera” · Arrecifes</p></div>`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Email provider rejected request");
  const result = (await response.json()) as { id?: string };
  if (!result.id) throw new Error("Email provider did not acknowledge request");
  // Acceptance is not a claim of final inbox delivery.
  return "accepted";
}
