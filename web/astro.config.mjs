import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
export default defineConfig({
  site:
    process.env.PUBLIC_SITE_URL ||
    "https://sociedad-italiana-de-arrecifes.pages.dev",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
