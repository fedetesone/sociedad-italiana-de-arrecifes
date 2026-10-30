/** FormSubmit accepts AJAX without navigating to its hosted confirmation page. */
export async function submitRequest(
  action: string,
  data: FormData,
  pageUrl: string,
  send: typeof fetch = fetch,
): Promise<"sent" | "activation"> {
  const endpoint = new URL(action);
  endpoint.pathname = `/ajax${endpoint.pathname}`;
  const name = String(data.get("Nombre y apellido") || "")
    .replace(/[\r\n]+/g, " ")
    .trim();
  data.set("_subject", `${data.get("_subject")} — ${name}`);
  data.set("_replyto", String(data.get("email") || ""));
  data.set("_url", pageUrl);
  data.delete("_next");
  const response = await send(endpoint.href, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: data,
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error("Submission rejected");
  const result = await response.json();
  if (/activat|confirm your email/i.test(String(result.message || "")))
    return "activation";
  if (result.success !== true && result.success !== "true") {
    throw new Error("Submission not confirmed");
  }
  return "sent";
}
