import assert from "node:assert/strict";
import test from "node:test";
import { submitRequest } from "./submit-request";

function fields() {
  const data = new FormData();
  data.set("Nombre y apellido", "Ana Pérez");
  data.set("email", "ana@example.com");
  data.set("_subject", "[Voz de Caprera] Consulta general");
  data.set("Mensaje", "Hola");
  data.set("_next", "https://example.com/gracias/");
  return data;
}
const action = "https://formsubmit.co/test@example.com";
const page = "https://example.com/contacto/";

test("sends short messages, reply address and personalized subject through AJAX", async () => {
  const send: typeof fetch = async (url, options) => {
    assert.equal(url, "https://formsubmit.co/ajax/test@example.com");
    const body = options!.body as FormData;
    assert.equal(body.get("Mensaje"), "Hola");
    assert.equal(
      body.get("_subject"),
      "[Voz de Caprera] Consulta general — Ana Pérez",
    );
    assert.equal(body.get("_replyto"), "ana@example.com");
    assert.equal(body.get("_url"), page);
    assert.equal(body.has("_next"), false);
    return Response.json({ success: "true" });
  };
  assert.equal(await submitRequest(action, fields(), page, send), "sent");
});

test("activation responses are not reported as delivered submissions", async () => {
  const send: typeof fetch = async () =>
    Response.json({ success: true, message: "Please activate your form" });
  assert.equal(await submitRequest(action, fields(), page, send), "activation");
});

test("HTTP errors, provider rejection, malformed responses and network failures reject", async () => {
  const responses = [
    async () => new Response("Unavailable", { status: 503 }),
    async () => Response.json({ success: "false" }),
    async () => new Response("Not JSON"),
    async () => {
      throw new TypeError("Network error");
    },
  ];
  for (const send of responses) {
    await assert.rejects(submitRequest(action, fields(), page, send));
  }
});
