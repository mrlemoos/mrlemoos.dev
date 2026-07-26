import { describe, expect, it } from "vitest";
import {
  deriveSlugFromTitle,
  resolveSlugForSave,
  slugIsFrozen,
} from "./slug.ts";

describe("deriveSlugFromTitle", () => {
  it("lowercases and hyphenates a title", () => {
    expect(deriveSlugFromTitle("Hello World")).toBe("hello-world");
  });

  it("strips punctuation and collapses hyphens", () => {
    expect(deriveSlugFromTitle("Don't Be Stupid — Be An Engineer!")).toBe(
      "dont-be-stupid-be-an-engineer"
    );
  });
});

describe("slugIsFrozen", () => {
  it("is frozen once the Post has ever been live", () => {
    expect(slugIsFrozen({ status: "live", everLived: true })).toBe(true);
    expect(slugIsFrozen({ status: "draft", everLived: true })).toBe(true);
  });

  it("is not frozen for a Draft that has never been live", () => {
    expect(slugIsFrozen({ status: "draft", everLived: false })).toBe(false);
  });
});

describe("resolveSlugForSave", () => {
  it("uses the proposed Slug while Draft and never live", () => {
    expect(
      resolveSlugForSave({
        currentSlug: "old-slug",
        proposedSlug: "new-slug",
        status: "draft",
        everLived: false,
      })
    ).toBe("new-slug");
  });

  it("falls back to deriving from title when proposed Slug is empty while Draft", () => {
    expect(
      resolveSlugForSave({
        currentSlug: "old-slug",
        proposedSlug: "",
        title: "Fresh Title",
        status: "draft",
        everLived: false,
      })
    ).toBe("fresh-title");
  });

  it("keeps the current Slug once frozen after first Publish", () => {
    expect(
      resolveSlugForSave({
        currentSlug: "frozen-slug",
        proposedSlug: "attempted-rename",
        title: "Attempted Rename",
        status: "live",
        everLived: true,
      })
    ).toBe("frozen-slug");
  });
});
