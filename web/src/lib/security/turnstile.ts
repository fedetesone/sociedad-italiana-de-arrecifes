export async function verifyTurnstile(
  token: string,
  secret: string,
  hostname: string,
  local: boolean,
  send: typeof fetch = fetch,
): Promise<boolean> {
  const response = await send(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) throw new Error("Turnstile unavailable");
  const result = (await response.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
  };
  // Cloudflare dummy keys return fixed hostname/action values. Only astro dev can use them.
  return (
    result.success === true &&
    (local || (result.hostname === hostname && result.action === "contact"))
  );
}
