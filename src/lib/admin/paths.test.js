import { describe, expect, it } from "vitest";
import { postRelativePath, isSafeSlug } from "./paths.ts";

describe("isSafeSlug", () => {
  it("accepts simple hyphenated Slugs", () => {
    expect(isSafeSlug("hello-world")).toBe(true);
  });

  it("rejects path traversal and separators", () => {
    expect(isSafeSlug("../etc/passwd")).toBe(false);
    expect(isSafeSlug("foo/bar")).toBe(false);
    expect(isSafeSlug("")).toBe(false);
  });
});

describe("postRelativePath", () => {
  it("maps a Slug to the Post path under the blog content folder", () => {
    expect(postRelativePath("hello-world")).toBe(
      "src/content/blog/hello-world.mdx"
    );
  });

  it("rejects unsafe Slugs", () => {
    expect(() => postRelativePath("../x")).toThrow(/invalid slug/i);
  });
});
