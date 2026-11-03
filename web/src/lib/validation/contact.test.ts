import test from "node:test";
import assert from "node:assert/strict";
import { contactSchema } from "./contact";
export const validContact = {
  kind: "contacto",
  name: "Ana Pérez",
  email: "ana@example.org",
  subject: "Consulta",
  message: "Hola",
  consent: true,
  website: "",
  turnstileToken: "token",
};
const { subject: _subject, ...request } = { ...validContact, phone: "" };
const valid = {
  alta: {
    ...request,
    kind: "alta",
    address: "España 694",
    city: "Arrecifes",
    postalCode: "2740",
  },
  baja: { ...request, kind: "baja", memberNumber: "", message: "" },
  escuela: {
    ...request,
    kind: "escuela",
    experience: "Quiero empezar desde cero",
    level: "Nivel 1",
  },
  salones: {
    ...request,
    kind: "salones",
    room: "Sala Regina",
    date: "2027-03-20",
    guests: "80",
    memberStatus: "Sí",
  },
  deudas: { ...request, kind: "deudas", memberNumber: "123" },
  panteones: { ...request, kind: "panteones", memberNumber: "" },
  ciudadania: { ...request, kind: "ciudadania" },
};
const accepts = (input: object) =>
  assert.equal(contactSchema.safeParse(input).success, true, String(input));
const rejects = (input: object) =>
  assert.equal(contactSchema.safeParse(input).success, false);

test("accepts short messages and trims content", () => {
  const parsed = contactSchema.parse({ ...validContact, message: " Hola " });
  assert.equal(parsed.message, "Hola");
});
test("rejects invalid email, empty and oversized fields, header injection, honeypot and recipient overrides", () => {
  for (const input of [
    { email: "invalid" },
    { name: " " },
    { subject: "\r\nBcc: spam@example.org" },
    { name: "a".repeat(101) },
    { subject: "a".repeat(141) },
    { message: " " },
    { message: "a".repeat(5001) },
    { consent: false },
    { website: "https://spam.example" },
    { turnstileToken: "" },
    { turnstileToken: "a".repeat(2049) },
    { to: "attacker@example.org" },
  ])
    rejects({ ...validContact, ...input });
});
test("accepts every procedure with its own fields", () => {
  for (const input of Object.values(valid)) accepts(input);
});
test("rejects unknown forms, fields from other forms and invalid procedure data", () => {
  for (const input of [
    { ...validContact, kind: "otro" },
    { ...valid.ciudadania, subject: "Asunto" },
    { ...valid.alta, room: "Sala Regina" },
    { ...valid.alta, address: " " },
    { ...valid.alta, city: "Arrecifes\nBcc: spam@example.org" },
    { ...valid.escuela, level: "Nivel 9" },
    { ...valid.salones, guests: "0" },
    { ...valid.salones, guests: "10001" },
    { ...valid.salones, date: "20/03/2027" },
    { ...valid.salones, memberStatus: "Tal vez" },
    { ...valid.deudas, message: "" },
  ])
    rejects(input);
});
