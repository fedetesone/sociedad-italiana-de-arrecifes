import { z } from "zod";

const singleLine = /^[^\r\n\x00-\x1f\x7f]*$/;
const text = () =>
  z
    .string({ error: "Ingresá un texto válido." })
    .regex(singleLine, "Usá una sola línea de texto.")
    .trim();
const line = (max: number, label: string) =>
  text().min(1, `Completá ${label}.`).max(max, `Usá hasta ${max} caracteres.`);
const optionalLine = (max: number) =>
  text().max(max, `Usá hasta ${max} caracteres.`).optional();
const message = (required = true) => {
  const value = z
    .string({ error: "Ingresá un texto válido." })
    .trim()
    .max(5000, "Usá hasta 5000 caracteres.");
  return required ? value.min(1, "Escribí tu mensaje.") : value.optional();
};
const choice = <const T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values, { error: "Elegí una opción de la lista." });

/** Select options, shared with the form markup. */
export const options = {
  experience: [
    "Quiero empezar desde cero",
    "Tengo conocimientos previos",
    "Busco perfeccionamiento",
  ],
  level: [
    "Nivel 1",
    "Nivel 2",
    "Nivel 3",
    "Nivel 4",
    "Conversación",
    "Necesito orientación",
  ],
  room: [
    "Sala Regina",
    "Sala Ravenna",
    "Patio de eventos",
    "Quiero asesoramiento",
  ],
  memberStatus: ["Prefiero consultar", "Sí", "No"],
} as const;

const common = {
  name: line(100, "tu nombre"),
  email: z
    .email("Ingresá un correo electrónico válido.")
    .max(254, "El correo es demasiado largo."),
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
};
const form = <K extends string, S extends z.ZodRawShape>(kind: K, shape: S) =>
  z.object({ kind: z.literal(kind), ...common, ...shape }).strict();
const phone = optionalLine(40);
const memberNumber = optionalLine(40);

/** One strict schema per form; unknown fields and recipients are rejected. */
export const contactSchema = z.discriminatedUnion("kind", [
  form("contacto", { subject: line(140, "el asunto"), message: message() }),
  form("alta", {
    phone,
    address: line(200, "tu domicilio"),
    city: line(100, "tu localidad"),
    postalCode: line(20, "tu código postal"),
    message: message(),
  }),
  form("baja", { phone, memberNumber, message: message(false) }),
  form("escuela", {
    phone,
    experience: choice(options.experience),
    level: choice(options.level),
    message: message(),
  }),
  form("salones", {
    phone,
    room: choice(options.room),
    date: z
      .union([z.literal(""), z.iso.date("Ingresá una fecha válida.")])
      .optional(),
    guests: z
      .string({ error: "Ingresá un número." })
      .regex(/^([1-9]\d{0,3}|10000)?$/, "Ingresá un número entre 1 y 10000.")
      .optional(),
    memberStatus: choice(options.memberStatus),
    message: message(),
  }),
  form("deudas", { phone, memberNumber, message: message() }),
  form("panteones", { phone, memberNumber, message: message() }),
  form("ciudadania", { phone, message: message() }),
]);
