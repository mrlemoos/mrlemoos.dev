// @vitest-environment node
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

it("prevents vertical overscroll chaining at the document root", () => {
  const source = readFileSync(new URL("./global.css", import.meta.url), "utf8");

  expect(source).toMatch(/html,\s*body\s*\{[^}]*overscroll-behavior-y:\s*none;/);
});
