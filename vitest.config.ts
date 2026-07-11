/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["src/**/*.test.js"],
    environment: "node",
    setupFiles: ["./test/setup.js"],
    passWithNoTests: true,
  },
});
