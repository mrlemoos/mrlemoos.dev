import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    name: "astro",
    include: ["src/**/*.test.{js,ts}"],
    exclude: ["src/components/text-match/**/*.test.ts"],
    environment: "node",
    setupFiles: ["./test/setup.js"],
    passWithNoTests: true,
  },
});
