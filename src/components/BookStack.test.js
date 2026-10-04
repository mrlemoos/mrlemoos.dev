// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderAstroComponent } from "@/test-utils/render-astro.js";
import BookStack from "./BookStack.astro";

const post = (id, date) => ({ id, title: `Post ${id}`, date: new Date(date) });
const render = (posts) => renderAstroComponent(BookStack, { props: { posts } });

describe("BookStack", () => {
  it("stacks the newest post on top", async () => {
    const html = await render([post("old", "2025-01-01"), post("new", "2026-01-01")]);

    expect(html.indexOf("/blog/new")).toBeLessThan(html.indexOf("/blog/old"));
  });

  it("cuts the stack once between consecutive years, labelled with both", async () => {
    const html = await render([
      post("a", "2026-08-01"),
      post("b", "2026-02-01"),
      post("c", "2025-05-01"),
    ]);

    expect(html.match(/class="stack-cut"/g)).toHaveLength(1);
    const cut = html.slice(html.indexOf('class="stack-cut"'));
    expect(cut.indexOf("2026")).toBeLessThan(cut.indexOf("2025"));
    // The cut sits between the last 2026 post and the first 2025 one.
    expect(html.indexOf("/blog/b")).toBeLessThan(html.indexOf('class="stack-cut"'));
    expect(html.indexOf('class="stack-cut"')).toBeLessThan(html.indexOf("/blog/c"));
  });

  it("draws no cut when every post shares a year", async () => {
    const html = await render([post("a", "2026-08-01"), post("b", "2026-02-01")]);

    expect(html).not.toContain('class="stack-cut"');
  });

  it("keeps the full title in the link even though the spine truncates it", async () => {
    const html = await render([post("a", "2026-08-01")]);

    expect(html).toMatch(/<a[^>]*href="\/blog\/a"[\s\S]*Post a[\s\S]*<\/a>/);
  });
});
