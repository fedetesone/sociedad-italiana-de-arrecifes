import test from "node:test";
import assert from "node:assert/strict";
import { contactSchema } from "./contact";
export const validContact = {
  name: "Ana Pérez",
  email: "ana@example.org",
  subject: "Consulta",
  message: "Hola",
  consent: true,
  website: "",
  turnstileToken: "token",
};
test("accepts short messages and trims content", () => {
  assert.equal(
    contactSchema.parse({ ...validContact, message: " Hola " }).message,
    "Hola",
  );
});
test("rejects invalid email, empty and oversized fields, header injection, honeypot and recipient overrides", () => {
  const invalid = [
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
  ];
  for (const input of invalid)
    assert.equal(
      contactSchema.safeParse({ ...validContact, ...input }).success,
      false,
    );
});
