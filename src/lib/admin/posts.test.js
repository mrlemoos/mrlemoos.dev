import { describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { savePost } from "./posts.ts";
import { parsePostFile } from "./frontmatter.ts";

async function makeRepo() {
  const root = await mkdtemp(path.join(tmpdir(), "admin-posts-"));
  await mkdir(path.join(root, "src/content/blog"), { recursive: true });
  return root;
}

describe("savePost", () => {
  it("writes Title to frontmatter and strips leading H1 from Body on disk", async () => {
    const root = await makeRepo();
    const result = await savePost(
      root,
      {
        slug: "hello-world",
        editorMarkdown: "# Hello World\n\nBody paragraph.\n",
        description: "A note.",
        tags: ["blog"],
        date: "2026-07-26",
        status: "draft",
        create: true,
      },
      async () => false
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const raw = await readFile(
      path.join(root, "src/content/blog/hello-world.mdx"),
      "utf8"
    );
    const parsed = parsePostFile(raw);
    expect(parsed.frontmatter.title).toBe("Hello World");
    expect(parsed.frontmatter.status).toBe("draft");
    expect(parsed.body.startsWith("#")).toBe(false);
    expect(parsed.body).toContain("Body paragraph.");
  });

  it("refuses Save when Body is not lossless for TipTap", async () => {
    const root = await makeRepo();
    const result = await savePost(
      root,
      {
        slug: "jsx-post",
        editorMarkdown: "# Title\n\nHello <Callout />\n",
        description: "Nope.",
        tags: ["blog"],
        date: "2026-07-26",
        status: "draft",
        create: true,
      },
      async () => false
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/lossless/i);
  });

  it("Save keeps Draft Status and ignores attempts to Save as live", async () => {
    const root = await makeRepo();
    await writeFile(
      path.join(root, "src/content/blog/stay-draft.mdx"),
      `---
title: "Stay Draft"
date: "2026-01-01"
description: "x"
tags:
  - blog
status: "draft"
---

Body.
`,
      "utf8"
    );

    const result = await savePost(
      root,
      {
        slug: "stay-draft",
        editorMarkdown: "# Stay Draft\n\nBody.\n",
        description: "x",
        tags: ["blog"],
        date: "2026-01-01",
        status: "live",
      },
      async () => false
    );

    expect(result.ok).toBe(true);
    const raw = await readFile(
      path.join(root, "src/content/blog/stay-draft.mdx"),
      "utf8"
    );
    expect(parsePostFile(raw).frontmatter.status).toBe("draft");
  });

  it("freezes Slug after the Post has been tracked (ever Published via git)", async () => {
    const root = await makeRepo();
    await writeFile(
      path.join(root, "src/content/blog/frozen-slug.mdx"),
      `---
title: "Frozen"
date: "2026-01-01"
description: "x"
tags:
  - blog
status: "draft"
---

Body.
`,
      "utf8"
    );

    const result = await savePost(
      root,
      {
        slug: "frozen-slug",
        proposedSlug: "new-slug",
        editorMarkdown: "# Frozen\n\nBody.\n",
        description: "x",
        tags: ["blog"],
        date: "2026-01-01",
        status: "draft",
      },
      async () => true
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.slug).toBe("frozen-slug");
  });
});
