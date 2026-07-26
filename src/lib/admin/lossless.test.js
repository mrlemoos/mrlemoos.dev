import { describe, expect, it } from "vitest";
import { isBodyLossless, roundTripBody } from "./lossless.ts";

describe("roundTripBody", () => {
  it("round-trips CommonMark paragraphs and emphasis", () => {
    const body = "Hello **world**.\n\nNext paragraph.\n";
    expect(roundTripBody(body).trimEnd()).toBe(body.trimEnd());
  });

  it("round-trips GFM strikethrough and task lists", () => {
    const body = "This is ~~struck~~.\n\n- [ ] todo\n- [x] done\n";
    expect(isBodyLossless(body)).toBe(true);
  });

  it("round-trips GFM tables without losing structure", () => {
    const body = "| a | b |\n| --- | --- |\n| 1 | 2 |\n";
    expect(isBodyLossless(body)).toBe(true);
  });
});

describe("isBodyLossless", () => {
  it("accepts Body dialect v1 content TipTap can represent", () => {
    expect(isBodyLossless("A plain paragraph with a [link](https://example.com).\n")).toBe(
      true
    );
  });

  it("refuses JSX that TipTap would escape or drop", () => {
    expect(isBodyLossless("Hello <Callout title=\"x\" />\n")).toBe(false);
  });

  it("refuses raw HTML blocks TipTap would mangle", () => {
    expect(isBodyLossless("<div class=\"note\">Hello</div>\n")).toBe(false);
  });
});
