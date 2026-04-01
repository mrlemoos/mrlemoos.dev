import eslintPluginAstro from "eslint-plugin-astro";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: [
      "dist/**",
      ".vercel/**",
      ".astro/**",
      ".next/**",
      "node_modules/**",
    ],
  },
  {
    files: ["**/*.astro"],
    processor: "astro/client-side-ts",
  }
);
