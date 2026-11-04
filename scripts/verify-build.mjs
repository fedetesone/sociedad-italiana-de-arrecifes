import assert from "node:assert/strict";
import { readdir, readFile, access } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const pages = new URL("web/src/pages/", root);
const output = new URL("web/dist/client/", root);
let count = 0;
for (const file of await readdir(pages, { recursive: true })) {
  if (!/\.(astro|ts)$/.test(file)) continue;
  const source = await readFile(new URL(file, pages), "utf8");
  if (file.startsWith("api/")) {
    assert.match(source, /export const prerender = false/);
    continue;
  }
  assert.match(
    source,
    /export const prerender = true/,
    `${file} must be static`,
  );
  if (file.includes("[")) continue; // Dynamic event slugs depend on published Sanity content.
  const route = file.replace(/\.(astro|ts)$/, "");
  const artifact = file.endsWith(".ts")
    ? route
    : route === "404"
      ? "404.html"
      : route.endsWith("index")
        ? `${route}.html`
        : `${route}/index.html`;
  await access(new URL(artifact, output));
  count++;
}
const config = JSON.parse(
  await readFile(new URL("web/dist/server/wrangler.json", root), "utf8"),
);
assert.deepEqual(config.assets.run_worker_first, ["/api/*"]);
assert.equal(
  config.kv_namespaces.length,
  0,
  "No sessions or KV database required",
);
await access(new URL("web/dist/server/entry.mjs", root));
await assert.rejects(
  access(new URL("api/contact/index.html", output)),
  "API must not be prerendered",
);
for (const file of await readdir(output, { recursive: true })) {
  if (!/\.(html|js)$/.test(file)) continue;
  const source = await readFile(new URL(file, output), "utf8");
  assert.ok(
    !source.includes("RESEND_API_KEY") &&
      !source.includes("TURNSTILE_SECRET_KEY"),
    `${file} must not contain server configuration`,
  );
}
// Check the generated SEO artifacts, including routes coming from Sanity.
const sitemap = await readFile(new URL("sitemap-0.xml", output), "utf8");
const homeHtml = await readFile(new URL("index.html", output), "utf8");
const schemaMatch = homeHtml.match(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
);
assert.ok(
  schemaMatch,
  "Homepage must identify the institution for search engines",
);
const schema = JSON.parse(schemaMatch[1]);
assert.equal(schema["@context"], "https://schema.org");
const organization = schema["@graph"].find(
  (item) => item["@type"] === "Organization",
);
const website = schema["@graph"].find((item) => item["@type"] === "WebSite");
assert.ok(organization.name && organization.url && organization.logo);
assert.equal(website.publisher["@id"], organization["@id"]);
const canonicalUrls = new Set();
for (const file of await readdir(output, { recursive: true })) {
  if (!file.endsWith(".html")) continue;
  const html = await readFile(new URL(file, output), "utf8");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical, `${file} needs a canonical URL`);
  assert.ok(!canonicalUrls.has(canonical), `${file} repeats a canonical URL`);
  canonicalUrls.add(canonical);
  assert.match(
    html,
    /<meta name="description" content="[^"]+"/,
    `${file} needs a description`,
  );
  if (html.includes('name="robots" content="noindex"')) {
    assert.ok(
      !sitemap.includes(`<loc>${canonical}</loc>`),
      `${file} is noindex and must not be in the sitemap`,
    );
  } else {
    assert.ok(
      sitemap.includes(`<loc>${canonical}</loc>`),
      `${file} must be discoverable in the sitemap`,
    );
  }
}
console.log(
  `Verified ${count} static artifacts, runtime API, asset routing no browser secret references, structured data and sitemap consistency.`,
);
