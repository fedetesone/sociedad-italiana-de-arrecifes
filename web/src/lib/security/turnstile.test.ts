import test from "node:test";
import assert from "node:assert/strict";
import { verifyTurnstile } from "./turnstile";
test("validates token, hostname and action with Cloudflare", async () => {
  const send: typeof fetch = async (url, init) => {
    assert.equal(
      url,
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    assert.deepEqual(JSON.parse(String(init?.body)), {
      secret: "secret",
      response: "token",
    });
    return Response.json({
      success: true,
      hostname: "example.org",
      action: "contact",
    });
  };
  assert.equal(
    await verifyTurnstile("token", "secret", "example.org", false, send),
    true,
  );
});
test("rejects failed, expired, mismatched-host and mismatched-action tokens", async () => {
  for (const result of [
    { success: false, "error-codes": ["timeout-or-duplicate"] },
    { success: true, hostname: "attacker.org", action: "contact" },
    { success: true, hostname: "example.org", action: "login" },
    {},
  ])
    assert.equal(
      await verifyTurnstile("token", "secret", "example.org", false, async () =>
        Response.json(result),
      ),
      false,
    );
});
test("network and provider failures do not bypass verification", async () => {
  await assert.rejects(
    verifyTurnstile(
      "token",
      "secret",
      "example.org",
      false,
      async () => new Response("", { status: 500 }),
    ),
  );
  await assert.rejects(
    verifyTurnstile("token", "secret", "example.org", false, async () => {
      throw new Error("network");
    }),
  );
});
