import vercel from "@astrojs/vercel";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import { remarkMathOptions } from "./src/lib/mdx-remark-math-options.ts";
import { isPublicSitemapPage } from "./src/lib/sitemap.ts";
import remarkMath from "remark-math";

export default defineConfig({
  site: "https://mrlemoos.dev",
  output: "server",
  adapter: vercel(),
  integrations: [
    react(),
    mdx({
      remarkPlugins: [[remarkMath, remarkMathOptions]],
      rehypePlugins: [rehypeKatex],
    }),
    sitemap({ filter: isPublicSitemapPage }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
