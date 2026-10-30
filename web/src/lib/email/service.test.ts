import test from "node:test";
import assert from "node:assert/strict";
import { sendContactEmail } from "./service";
const contact = {
  name: "Ana <script>",
  email: "ana@example.org",
  subject: "Sala & patio",
  message: '<img src=x onerror="alert(1)">',
};
const env = {
  EMAIL_PROVIDER: "resend",
  RESEND_API_KEY: "test-key",
  EMAIL_FROM: "Sociedad <web@example.org>",
  EMAIL_TO: "institution@example.org",
};
test("Resend uses fixed addresses, reply-to and escaped HTML", async () => {
  const send: typeof fetch = async (url, init) => {
    assert.equal(url, "https://api.resend.com/emails");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.from, env.EMAIL_FROM);
    assert.deepEqual(body.to, [env.EMAIL_TO]);
    assert.equal(body.reply_to, contact.email);
    assert.equal(body.subject, "[Voz de Caprera] Sala & patio");
    assert.ok(body.html.includes("&lt;img"));
    assert.ok(!body.html.includes("<script>"));
    assert.ok(body.text.includes(contact.message));
    return Response.json({ id: "email-test-id" });
  };
  assert.equal(await sendContactEmail(contact, env, false, send), "accepted");
});
test("provider rejection, malformed acknowledgement and network failure never claim success", async () => {
  for (const send of [
    async () => Response.json({ error: "bad key" }, { status: 401 }),
    async () => Response.json({}),
    async () => {
      throw new Error("network");
    },
  ])
    await assert.rejects(sendContactEmail(contact, env, false, send));
});
test("mock logs only locally and never delivers; production refuses mock", async (t) => {
  const log = t.mock.method(console, "info", () => {});
  const send: typeof fetch = async () => {
    throw new Error("Must not send");
  };
  assert.equal(
    await sendContactEmail(contact, { EMAIL_PROVIDER: "mock" }, true, send),
    "simulated",
  );
  assert.equal(log.mock.callCount(), 1);
  await assert.rejects(
    sendContactEmail(contact, { EMAIL_PROVIDER: "mock" }, false, send),
  );
  assert.equal(log.mock.callCount(), 1);
});
