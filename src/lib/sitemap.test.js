import { describe, expect, it } from "vitest";
import { isPublicSitemapPage } from "./sitemap.ts";

describe("isPublicSitemapPage", () => {
  it("keeps public pages", () => {
    expect(isPublicSitemapPage("https://mrlemoos.dev/")).toBe(true);
    expect(isPublicSitemapPage("https://mrlemoos.dev/blog/my-post/")).toBe(true);
    expect(isPublicSitemapPage("https://mrlemoos.dev/blog/tags/astro/")).toBe(
      true
    );
  });

  it("drops the DEV-only Local Admin, which 404s in production", () => {
    expect(isPublicSitemapPage("https://mrlemoos.dev/admin/")).toBe(false);
    expect(isPublicSitemapPage("https://mrlemoos.dev/admin/posts/new/")).toBe(
      false
    );
  });

  it("keeps a public page whose slug merely begins with the word admin", () => {
    expect(
      isPublicSitemapPage("https://mrlemoos.dev/blog/administering-a-monorepo/")
    ).toBe(true);
    expect(isPublicSitemapPage("https://mrlemoos.dev/administration/")).toBe(
      true
    );
  });
});
