import test from "node:test";
import assert from "node:assert/strict";
import { handleContact } from "./contact-handler";
import type { ContactBindings } from "../../types/contact";
const body = {
  name: "Ana",
  email: "ana@example.org",
  subject: "Consulta",
  message: "Hola",
  consent: true,
  website: "",
  turnstileToken: "token",
};
const env: ContactBindings = {
  EMAIL_PROVIDER: "resend",
  RESEND_API_KEY: "test-key",
  EMAIL_FROM: "web@example.org",
  EMAIL_TO: "institution@example.org",
  CONTACT_ORIGIN: "https://example.org",
  TURNSTILE_SECRET_KEY: "real-secret-test-placeholder",
  CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
};
const options = { development: false, sitekey: "real-sitekey-placeholder" };
const request = (overrides = {}, headers = {}) =>
  new Request("https://example.org/api/contact", {
    method: "POST",
    headers: {
      Origin: "https://example.org",
      "Content-Type": "application/json",
      "CF-Connecting-IP": "192.0.2.1",
      ...headers,
    },
    body: JSON.stringify({ ...body, ...overrides }),
  });
const acceptedFetch: typeof fetch = async (url) =>
  String(url).includes("siteverify")
    ? Response.json({
        success: true,
        hostname: "example.org",
        action: "contact",
      })
    : Response.json({ id: "test-email-id" });

test("POST acknowledges provider acceptance, with no cache", async () => {
  const response = await handleContact(request(), env, options, acceptedFetch);
  assert.equal(response.status, 202);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(
    ((await response.json()) as { status: string }).status,
    "accepted",
  );
});
test("rejects other methods and foreign origins", async () => {
  const get = await handleContact(
    new Request("https://example.org/api/contact"),
    env,
    options,
  );
  assert.equal(get.status, 405);
  assert.equal(get.headers.get("Allow"), "POST");
  assert.equal(
    (
      await handleContact(
        request({}, { Origin: "https://attacker.org" }),
        env,
        options,
      )
    ).status,
    403,
  );
});
test("JSON-only, malformed JSON, actual body size limits and structured validation", async () => {
  assert.equal(
    (
      await handleContact(
        request({}, { "Content-Type": "text/plain" }),
        env,
        options,
      )
    ).status,
    415,
  );
  const malformed = new Request(request(), { body: "{" });
  assert.equal((await handleContact(malformed, env, options)).status, 400);
  assert.equal(
    (await handleContact(request({ message: "a".repeat(33000) }), env, options))
      .status,
    413,
  );
  const invalid = await handleContact(
    request({ email: "invalid" }),
    env,
    options,
  );
  assert.equal(invalid.status, 422);
  assert.ok(
    ((await invalid.json()) as { error: { fields: { email: string[] } } }).error
      .fields.email.length,
  );
});
test("fails closed without config, with mock provider or official test keys in production", async () => {
  for (const patch of [
    { EMAIL_PROVIDER: "mock" },
    { RESEND_API_KEY: undefined },
    { EMAIL_FROM: undefined },
    { EMAIL_TO: undefined },
    { TURNSTILE_SECRET_KEY: undefined },
    { CONTACT_ORIGIN: undefined },
    { CONTACT_RATE_LIMITER: undefined },
    { TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA" },
  ])
    assert.equal(
      (await handleContact(request(), { ...env, ...patch }, options)).status,
      503,
    );
  for (const sitekey of [
    "",
    "1x00000000000000000000AA",
    "2x00000000000000000000AB",
    "3x00000000000000000000FF",
  ])
    assert.equal(
      (await handleContact(request(), env, { ...options, sitekey })).status,
      503,
    );
  assert.equal(
    (
      await handleContact(
        request(),
        { ...env, EMAIL_PROVIDER: "mock" },
        { ...options, development: true },
      )
    ).status,
    503,
  );
});
test("honeypot and recipient injection never call external services", async () => {
  let calls = 0;
  const send: typeof fetch = async () => {
    calls++;
    return Response.json({});
  };
  for (const patch of [{ website: "spam" }, { to: "attacker@example.org" }])
    assert.equal(
      (await handleContact(request(patch), env, options, send)).status,
      422,
    );
  assert.equal(calls, 0);
});
test("rate limit rejects and exposes retry delay; limiter failures close endpoint", async () => {
  const limited = await handleContact(
    request(),
    {
      ...env,
      CONTACT_RATE_LIMITER: { limit: async () => ({ success: false }) },
    },
    options,
  );
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Retry-After"), "60");
  const failed = await handleContact(
    request(),
    {
      ...env,
      CONTACT_RATE_LIMITER: {
        limit: async () => {
          throw new Error("binding");
        },
      },
    },
    options,
  );
  assert.equal(failed.status, 503);
});
test("failed Turnstile and failed email are distinct, safe errors", async () => {
  const rejected = await handleContact(request(), env, options, async () =>
    Response.json({ success: false }),
  );
  assert.equal(rejected.status, 403);
  const providerDown: typeof fetch = async (url) =>
    String(url).includes("siteverify")
      ? acceptedFetch(url)
      : Response.json(
          { secret: "sensitive provider response" },
          { status: 500 },
        );
  const failed = await handleContact(request(), env, options, providerDown);
  assert.equal(failed.status, 502);
  assert.ok(!(await failed.text()).includes("sensitive"));
});
test("local mock returns simulated, never claims sent", async (t) => {
  t.mock.method(console, "info", () => {});
  const localRequest = new Request("http://localhost:4321/api/contact", {
    method: "POST",
    headers: {
      Origin: "http://localhost:4321",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = await handleContact(
    localRequest,
    {
      ...env,
      EMAIL_PROVIDER: "mock",
      TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
    },
    { development: true, sitekey: "1x00000000000000000000AA" },
    async () => Response.json({ success: true }),
  );
  assert.equal(result.status, 200);
  assert.equal(
    ((await result.json()) as { status: string }).status,
    "simulated",
  );
});
