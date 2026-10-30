import { z } from "zod";

const line = (max: number, label: string) =>
  z
    .string({ error: "Ingresá un texto válido." })
    .regex(/^[^\r\n\x00-\x1f\x7f]*$/, "Usá una sola línea de texto.")
    .trim()
    .min(1, `Completá ${label}.`)
    .max(max, `Usá hasta ${max} caracteres.`);
export const contactSchema = z
  .object({
    name: line(100, "tu nombre"),
    email: z
      .email("Ingresá un correo electrónico válido.")
      .max(254, "El correo es demasiado largo."),
    subject: line(140, "el asunto"),
    message: z
      .string({ error: "Ingresá un texto válido." })
      .trim()
      .min(1, "Escribí tu mensaje.")
      .max(5000, "Usá hasta 5000 caracteres."),
    consent: z.literal(true, {
      error: "Necesitamos tu autorización para responderte.",
    }),
    website: z
      .string({ error: "Ingresá un texto válido." })
      .max(0, "No pudimos validar la solicitud."),
    turnstileToken: z
      .string({ error: "Ingresá un texto válido." })
      .min(1, "Completá la verificación de seguridad.")
      .max(2048, "La verificación de seguridad no es válida."),
  })
  .strict();
