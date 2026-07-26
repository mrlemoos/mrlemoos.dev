import { describe, expect, it } from "vitest";
import { isLivePost, filterLivePosts } from "./public-filter.ts";

describe("isLivePost", () => {
  it('treats status "live" as public', () => {
    expect(isLivePost({ status: "live" })).toBe(true);
  });

  it('treats missing status as live for legacy Posts', () => {
    expect(isLivePost({})).toBe(true);
    expect(isLivePost({ status: undefined })).toBe(true);
  });

  it('excludes status "draft"', () => {
    expect(isLivePost({ status: "draft" })).toBe(false);
  });
});

describe("filterLivePosts", () => {
  it("returns only live Posts", () => {
    const posts = [
      { id: "a", data: { status: "live" } },
      { id: "b", data: { status: "draft" } },
      { id: "c", data: {} },
    ];

    expect(filterLivePosts(posts).map((p) => p.id)).toEqual(["a", "c"]);
  });
});
