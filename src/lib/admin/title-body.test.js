import { describe, expect, it } from "vitest";
import {
  injectTitleAsH1,
  extractTitleFromEditorMarkdown,
  stripLeadingH1FromBody,
} from "./title-body.ts";

describe("injectTitleAsH1", () => {
  it("prefixes the Body with an H1 from the Title", () => {
    expect(injectTitleAsH1("My Title", "Paragraph.\n")).toBe(
      "# My Title\n\nParagraph.\n"
    );
  });

  it("replaces an existing leading H1 rather than duplicating", () => {
    expect(injectTitleAsH1("New Title", "# Old Title\n\nParagraph.\n")).toBe(
      "# New Title\n\nParagraph.\n"
    );
  });
});

describe("extractTitleFromEditorMarkdown", () => {
  it("reads the Title from the leading H1", () => {
    expect(
      extractTitleFromEditorMarkdown("# Hello World\n\nBody paragraph.\n")
    ).toEqual({ title: "Hello World", body: "Body paragraph.\n" });
  });

  it("returns empty Title when no leading H1 is present", () => {
    expect(extractTitleFromEditorMarkdown("Just a paragraph.\n")).toEqual({
      title: "",
      body: "Just a paragraph.\n",
    });
  });
});

describe("stripLeadingH1FromBody", () => {
  it("removes a leading H1 so Save does not persist Title into the Body", () => {
    expect(stripLeadingH1FromBody("# My Title\n\nParagraph.\n")).toBe(
      "Paragraph.\n"
    );
  });

  it("leaves Body unchanged when there is no leading H1", () => {
    expect(stripLeadingH1FromBody("Paragraph.\n")).toBe("Paragraph.\n");
  });
});
