import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { projects: ["./vitest.astro.config.ts", "./vitest.svelte.config.ts"] },
});
