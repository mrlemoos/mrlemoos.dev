import { describe, expect, it } from "vitest";
import { renderAstroComponent } from "@/test-utils/render-astro.js";
import TextMatchGuide from "./TextMatchGuide.astro";

describe("Text Match discovery", () => {
  it("explains editing and export without client JavaScript", async () => {
    const html = await renderAstroComponent(TextMatchGuide);
    expect(html).toContain("How to make a text match cut");
    expect(html).toContain("WebM");
    expect(html).toContain("1080");
    expect(html).toContain("konijn.co");
    expect(html).toContain("leonardo_lemos");
    expect(html).toContain("Follow me on X");
    expect(html).toContain("Your words, in print");
  });
});
