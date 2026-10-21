import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    name: "svelte",
    include: ["src/components/text-match/**/*.test.ts"],
    environment: "jsdom",
    setupFiles: ["./test/setup.js"],
  },
});
