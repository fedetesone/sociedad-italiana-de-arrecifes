import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
const env = loadEnv(
  process.env.NODE_ENV || "production",
  process.cwd(),
  "PUBLIC_",
);

// A build without these would publish placeholder URLs or an empty agenda.
// CI and local builds without CMS opt out explicitly.
const requireBuildConfig = {
  name: "require-build-config",
  hooks: {
    "astro:config:setup": ({ command }) => {
      if (command !== "build" || process.env.ALLOW_MISSING_BUILD_CONFIG) return;
      const missing = ["PUBLIC_SITE_URL", "PUBLIC_SANITY_PROJECT_ID"].filter(
        (key) => !env[key],
      );
      if (missing.length)
        throw new Error(
          `Missing ${missing.join(", ")}. Set ALLOW_MISSING_BUILD_CONFIG=1 only for builds that will not be deployed.`,
        );
    },
  },
};

export default defineConfig({
  site: env.PUBLIC_SITE_URL || "https://example.invalid",
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
    prerenderEnvironment: "node",
  }),
  session: false,
  trailingSlash: "ignore",
  integrations: [requireBuildConfig, sitemap()],
  vite: { plugins: [tailwindcss()] },
});
