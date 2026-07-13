import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { defineConfig } from "astro/config";
import externalLinks from "./src/plugins/external-links";
import articleParagraphs from "./src/plugins/article-paragraphs";

export default defineConfig({
  site: "https://digows.com",
  output: "static",
  // Cloudflare Static Assets owns HTML slash normalization. Keeping Astro
  // neutral avoids treating file endpoints such as rss.xml as directories.
  trailingSlash: "ignore",
  i18n: {
    defaultLocale: "en",
    locales: [
      "en",
      { path: "pt-br", codes: ["pt-BR"] },
      "es",
      "fr",
      { path: "zh-hans", codes: ["zh-Hans"] },
    ],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
      fallbackType: "redirect",
    },
  },
  integrations: [sitemap({ filter: (page) => !/\.png\/?$/u.test(page) })],
  markdown: {
    processor: unified({ rehypePlugins: [articleParagraphs, externalLinks] }),
  },
  vite: {
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        emitTsDeclarations: true,
      }),
    ],
    build: {
      // The isolated About route owns a deliberate 3D runtime; other pages do not load this chunk.
      chunkSizeWarningLimit: 550,
    },
  },
});
