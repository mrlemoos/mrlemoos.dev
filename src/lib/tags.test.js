import { describe, expect, it } from "vitest";
import { groupPostsByTag, selectRelatedPosts, slugifyTag } from "./tags.ts";

const post = (id, tags, date, status) => ({
  id,
  data: {
    title: id,
    description: `About ${id}`,
    tags,
    date: new Date(date),
    ...(status ? { status } : {}),
  },
});

describe("slugifyTag", () => {
  it("lower-cases and turns spaces into hyphens", () => {
    expect(slugifyTag("Design Systems")).toBe("design-systems");
  });

  it("strips diacritics and punctuation", () => {
    expect(slugifyTag("Café Ops")).toBe("cafe-ops");
    expect(slugifyTag("next.js")).toBe("next-js");
  });

  it("collapses repeated separators and trims the edges", () => {
    expect(slugifyTag("  Tailwind   CSS  ")).toBe("tailwind-css");
    expect(slugifyTag("--ai--")).toBe("ai");
  });

  it("returns an empty slug when nothing URL-safe remains", () => {
    expect(slugifyTag("!!!")).toBe("");
    expect(slugifyTag("   ")).toBe("");
  });
});

describe("groupPostsByTag", () => {
  it("returns one group per tag slug with its live posts newest first", () => {
    const groups = groupPostsByTag([
      post("a", ["ai"], "2025-01-01"),
      post("b", ["ai"], "2025-03-01"),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].slug).toBe("ai");
    expect(groups[0].label).toBe("ai");
    expect(groups[0].posts.map((p) => p.id)).toEqual(["b", "a"]);
  });

  it("merges tags that slugify to the same URL", () => {
    const groups = groupPostsByTag([
      post("a", ["Tailwind CSS"], "2025-01-01"),
      post("b", ["tailwind css"], "2025-02-01"),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].slug).toBe("tailwind-css");
    expect(groups[0].tags).toEqual(["Tailwind CSS", "tailwind css"]);
    expect(groups[0].posts.map((p) => p.id)).toEqual(["b", "a"]);
  });

  it("labels a merged group with the most-used spelling", () => {
    const groups = groupPostsByTag([
      post("a", ["tailwind css"], "2025-01-01"),
      post("b", ["tailwind css"], "2025-02-01"),
      post("c", ["Tailwind CSS"], "2025-03-01"),
    ]);

    expect(groups[0].label).toBe("tailwind css");
  });

  it("never lists a post twice when it repeats an equivalent tag", () => {
    const groups = groupPostsByTag([post("a", ["AI", "ai"], "2025-01-01")]);

    expect(groups[0].posts.map((p) => p.id)).toEqual(["a"]);
  });

  it("excludes draft posts", () => {
    const groups = groupPostsByTag([
      post("a", ["ai"], "2025-01-01", "live"),
      post("b", ["ai"], "2025-02-01", "draft"),
      post("c", ["secret"], "2025-02-01", "draft"),
    ]);

    expect(groups.map((g) => g.slug)).toEqual(["ai"]);
    expect(groups[0].posts.map((p) => p.id)).toEqual(["a"]);
  });

  it("skips tags with no URL-safe characters", () => {
    const groups = groupPostsByTag([post("a", ["ai", "???"], "2025-01-01")]);

    expect(groups.map((g) => g.slug)).toEqual(["ai"]);
  });

  it("orders groups by post count, then by slug", () => {
    const groups = groupPostsByTag([
      post("a", ["zeta", "ai"], "2025-01-01"),
      post("b", ["ai", "beta"], "2025-02-01"),
    ]);

    expect(groups.map((g) => g.slug)).toEqual(["ai", "beta", "zeta"]);
  });
});

describe("selectRelatedPosts", () => {
  it("prefers posts sharing the rarer tags over merely recent ones", () => {
    const current = post("current", ["blog", "tailwind"], "2025-01-04");
    const all = [
      current,
      post("b", ["blog", "tailwind"], "2025-01-01"),
      post("c", ["blog"], "2025-01-03"),
      post("d", ["blog"], "2025-01-02"),
    ];

    expect(selectRelatedPosts(current, all, 2).map((p) => p.id)).toEqual([
      "b",
      "c",
    ]);
  });

  it("matches tags across spelling variants that share a slug", () => {
    const current = post("current", ["Tailwind CSS"], "2025-01-04");
    const all = [
      current,
      post("b", ["unrelated"], "2025-01-03"),
      post("c", ["tailwind css"], "2025-01-01"),
    ];

    expect(selectRelatedPosts(current, all, 1).map((p) => p.id)).toEqual(["c"]);
  });

  it("excludes the current post", () => {
    const current = post("current", ["ai"], "2025-01-04");
    const all = [current, post("b", ["ai"], "2025-01-01")];

    expect(selectRelatedPosts(current, all).map((p) => p.id)).toEqual(["b"]);
  });

  it("never returns draft posts, however well they match", () => {
    const current = post("current", ["ai", "css"], "2025-01-04");
    const all = [
      current,
      post("draft", ["ai", "css"], "2025-01-03", "draft"),
      post("b", ["ai"], "2025-01-01", "live"),
    ];

    expect(selectRelatedPosts(current, all).map((p) => p.id)).toEqual(["b"]);
  });

  it("falls back to the most recent posts when no tags are shared", () => {
    const current = post("current", ["solo"], "2025-01-04");
    const all = [
      current,
      post("old", ["other"], "2024-01-01"),
      post("new", ["other"], "2025-01-03"),
    ];

    expect(selectRelatedPosts(current, all).map((p) => p.id)).toEqual([
      "new",
      "old",
    ]);
  });

  it("caps the selection at three by default", () => {
    const current = post("current", ["ai"], "2025-01-09");
    const all = [
      current,
      post("a", ["ai"], "2025-01-05"),
      post("b", ["ai"], "2025-01-04"),
      post("c", ["ai"], "2025-01-03"),
      post("d", ["ai"], "2025-01-02"),
    ];

    expect(selectRelatedPosts(current, all).map((p) => p.id)).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("returns an empty list when the current post is the only live one", () => {
    const current = post("current", ["ai"], "2025-01-09");

    expect(selectRelatedPosts(current, [current])).toEqual([]);
  });
});
