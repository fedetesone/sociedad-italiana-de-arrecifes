import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
const { PUBLIC_SITE_URL } = loadEnv(
  process.env.NODE_ENV || "production",
  process.cwd(),
  "PUBLIC_",
);

export default defineConfig({
  site: PUBLIC_SITE_URL || "https://example.invalid",
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
    prerenderEnvironment: "node",
  }),
  session: false,
  trailingSlash: "ignore",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
