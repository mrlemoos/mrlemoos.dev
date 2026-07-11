import { describe, expect, it } from "vitest";
import { SITE_BRAND_NAME, titleWithBrand } from "./seo.ts";

describe("titleWithBrand", () => {
  it("appends the site brand to an article title", () => {
    expect(titleWithBrand("My Post")).toBe(`My Post | ${SITE_BRAND_NAME}`);
  });
});
