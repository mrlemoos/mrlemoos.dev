// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderAstroComponent } from "@/test-utils/render-astro.js";
import WritingList from "./WritingList.astro";

const item = (overrides = {}) => ({
  href: "/blog/a-post",
  title: "A post",
  date: new Date("2025-05-14T00:00:00.000Z"),
  ...overrides,
});

const render = (props) => renderAstroComponent(WritingList, { props });

describe("WritingList", () => {
  it("renders one linked row per item", async () => {
    const html = await render({
      items: [item(), item({ href: "/blog/another", title: "Another post" })],
    });

    expect(html).toContain('href="/blog/a-post"');
    expect(html).toContain("A post");
    expect(html).toContain('href="/blog/another"');
    expect(html).toContain("Another post");
    expect(html.match(/<li/g)).toHaveLength(2);
  });

  it("renders nothing at all when there are no items", async () => {
    const html = await render({ items: [] });

    expect(html).not.toContain("<ul");
    expect(html).not.toContain("<li");
  });

  it("prints the description only when the item carries one", async () => {
    const withDescription = await render({
      items: [item({ description: "The supporting line." })],
    });
    const without = await render({ items: [item()] });

    expect(withDescription).toContain("The supporting line.");
    expect(without).not.toContain("writing-row-description");
  });

  it("gives the date a machine-readable datetime", async () => {
    const html = await render({ items: [item()] });

    expect(html).toContain('datetime="2025-05-14T00:00:00.000Z"');
  });

  it("opens external items in a new tab, and internal ones in place", async () => {
    const external = await render({
      items: [item({ href: "https://example.com/p", external: true })],
    });
    const internal = await render({ items: [item()] });

    expect(external).toContain('target="_blank"');
    expect(external).toContain('rel="noopener noreferrer"');
    expect(internal).not.toContain('target="_blank"');
  });

  it("names the publisher on an external item", async () => {
    const html = await render({
      items: [
        item({ href: "https://example.com/p", external: true, publisher: "Dev.to" }),
      ],
    });

    expect(html).toContain("Dev.to");
  });

  it("numbers rows from 01 when asked, and hides the ordinals from screen readers", async () => {
    const html = await render({
      items: [item(), item({ href: "/blog/another", title: "Another post" })],
      numbered: true,
    });

    expect(html).toContain(">01<");
    expect(html).toContain(">02<");
    expect(html).toMatch(/writing-row-index[^>]*aria-hidden|aria-hidden[^>]*writing-row-index/);
  });

  it("staggers the entrance from startIndex, capped so a long list's tail isn't late", async () => {
    const html = await render({
      items: Array.from({ length: 9 }, (_, i) =>
        item({ href: `/blog/p-${i}`, title: `Post ${i}` })
      ),
      startIndex: 2,
    });

    expect(html).toContain("--reveal-index: 2");
    expect(html).toContain("--reveal-index: 8");
    expect(html).not.toContain("--reveal-index: 9");
  });

  it("renders titles as spans by default and as headings when asked", async () => {
    const plain = await render({ items: [item()] });
    const headed = await render({ items: [item()], titleTag: "h2" });

    expect(plain).toContain('<span class="writing-row-title"');
    expect(headed).toContain('<h2 class="writing-row-title"');
    expect(headed).toContain("</h2>");
  });

  it("leaves the ordinals out unless numbering was asked for", async () => {
    const html = await render({ items: [item()] });

    expect(html).not.toContain("writing-row-index");
  });
});
