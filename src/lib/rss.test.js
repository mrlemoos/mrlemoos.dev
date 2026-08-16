import { describe, expect, it } from "vitest";
import { buildFeedItems } from "./rss.ts";

const post = (id, { date, status, tags = ["frontend"], updated } = {}) => ({
  id,
  data: {
    title: `Title of ${id}`,
    description: `About ${id}`,
    date: new Date(date),
    tags,
    ...(status ? { status } : {}),
    ...(updated ? { updated: new Date(updated) } : {}),
  },
});

describe("buildFeedItems", () => {
  it("maps a post to a feed item", () => {
    const items = buildFeedItems([post("my-post", { date: "2026-01-05" })]);

    expect(items).toEqual([
      {
        title: "Title of my-post",
        description: "About my-post",
        pubDate: new Date("2026-01-05"),
        link: "/blog/my-post",
        categories: ["frontend"],
      },
    ]);
  });

  it("orders the newest post first", () => {
    const items = buildFeedItems([
      post("older", { date: "2025-03-01" }),
      post("newest", { date: "2026-08-01" }),
      post("middle", { date: "2026-02-01" }),
    ]);

    expect(items.map((item) => item.link)).toEqual([
      "/blog/newest",
      "/blog/middle",
      "/blog/older",
    ]);
  });

  it("excludes draft posts", () => {
    const items = buildFeedItems([
      post("live-one", { date: "2026-01-01" }),
      post("secret", { date: "2026-06-01", status: "draft" }),
    ]);

    expect(items.map((item) => item.link)).toEqual(["/blog/live-one"]);
  });

  it("treats a post with no status as live", () => {
    const items = buildFeedItems([
      post("legacy", { date: "2026-01-01", status: undefined }),
    ]);

    expect(items).toHaveLength(1);
  });

  it("keeps the publication date even when the post was updated later", () => {
    const [item] = buildFeedItems([
      post("revised", { date: "2026-01-01", updated: "2026-07-01" }),
    ]);

    expect(item.pubDate).toEqual(new Date("2026-01-01"));
  });

  it("omits categories when a post has no tags", () => {
    const [item] = buildFeedItems([
      post("untagged", { date: "2026-01-01", tags: [] }),
    ]);

    expect(item.categories).toBeUndefined();
  });

  it("returns an empty feed when every post is a draft", () => {
    const items = buildFeedItems([
      post("wip", { date: "2026-01-01", status: "draft" }),
    ]);

    expect(items).toEqual([]);
  });
});
