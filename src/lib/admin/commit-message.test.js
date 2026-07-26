import { describe, expect, it } from "vitest";
import { buildBlogCommitMessage } from "./commit-message.ts";

describe("buildBlogCommitMessage", () => {
  it('builds an add message for a first Publish', () => {
    expect(buildBlogCommitMessage({ action: "add", title: "Hello World" })).toBe(
      'docs(blog): add "Hello World"'
    );
  });

  it('builds an update message for a re-Publish', () => {
    expect(
      buildBlogCommitMessage({ action: "update", title: "Hello World" })
    ).toBe('docs(blog): update "Hello World"');
  });

  it('builds a remove message for Delete', () => {
    expect(
      buildBlogCommitMessage({ action: "remove", title: "Hello World" })
    ).toBe('docs(blog): remove "Hello World"');
  });
});
