import { describe, expect, it, vi } from "vitest";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { publishPost, unpublishPost, deletePostWithGit } from "./actions.ts";
import { parsePostFile } from "./frontmatter.ts";

async function makeRepoWithPost(contents, slug = "sample") {
  const root = await mkdtemp(path.join(tmpdir(), "admin-actions-"));
  await mkdir(path.join(root, "src/content/blog"), { recursive: true });
  const relativePath = `src/content/blog/${slug}.mdx`;
  await writeFile(path.join(root, relativePath), contents, "utf8");
  return { root, relativePath, slug };
}

describe("publishPost", () => {
  it('first Publish of an untracked Draft uses add and leaves Updated unset', async () => {
    const { root, relativePath, slug } = await makeRepoWithPost(`---
title: "First"
date: "2026-07-01"
description: "d"
tags:
  - blog
status: "draft"
---

Hello.
`);

    const run = vi.fn().mockImplementation(async (args) => {
      if (args[0] === "rev-parse") return { stdout: "main\n", stderr: "" };
      if (args[0] === "ls-files") throw new Error("untracked");
      return { stdout: "", stderr: "" };
    });

    const result = await publishPost(root, run, slug);
    expect(result.message).toBe('docs(blog): add "First"');

    const parsed = parsePostFile(await readFile(path.join(root, relativePath), "utf8"));
    expect(parsed.frontmatter.status).toBe("live");
    expect(parsed.frontmatter.updated).toBeUndefined();
  });

  it('re-Publish of a tracked Post uses update and stamps Updated', async () => {
    const { root, relativePath, slug } = await makeRepoWithPost(`---
title: "Again"
date: "2026-07-01"
description: "d"
tags:
  - blog
status: "draft"
---

Hello.
`);

    const run = vi.fn().mockImplementation(async (args) => {
      if (args[0] === "rev-parse") return { stdout: "main\n", stderr: "" };
      if (args[0] === "ls-files") return { stdout: relativePath + "\n", stderr: "" };
      return { stdout: "", stderr: "" };
    });

    const result = await publishPost(root, run, slug);
    expect(result.message).toBe('docs(blog): update "Again"');

    const parsed = parsePostFile(await readFile(path.join(root, relativePath), "utf8"));
    expect(parsed.frontmatter.status).toBe("live");
    expect(parsed.frontmatter.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("unpublishPost", () => {
  it("sets Status to draft and commit+pushes on main", async () => {
    const { root, relativePath, slug } = await makeRepoWithPost(`---
title: "Live One"
date: "2026-07-01"
description: "d"
tags:
  - blog
status: "live"
---

Hello.
`);

    const run = vi.fn().mockImplementation(async (args) => {
      if (args[0] === "rev-parse") return { stdout: "main\n", stderr: "" };
      if (args[0] === "ls-files") return { stdout: relativePath + "\n", stderr: "" };
      return { stdout: "", stderr: "" };
    });

    await unpublishPost(root, run, slug);
    const parsed = parsePostFile(await readFile(path.join(root, relativePath), "utf8"));
    expect(parsed.frontmatter.status).toBe("draft");
    expect(run.mock.calls.some((c) => c[0][0] === "push")).toBe(true);
  });
});

describe("deletePostWithGit", () => {
  it("unlinks an untracked Draft without pushing", async () => {
    const { root, relativePath, slug } = await makeRepoWithPost(`---
title: "Gone"
date: "2026-07-01"
description: "d"
tags:
  - blog
status: "draft"
---

Bye.
`);

    const run = vi.fn().mockImplementation(async (args) => {
      if (args[0] === "ls-files") throw new Error("untracked");
      return { stdout: "", stderr: "" };
    });

    const result = await deletePostWithGit(root, run, slug);
    expect(result.pushed).toBe(false);
    await expect(readFile(path.join(root, relativePath), "utf8")).rejects.toThrow();
    expect(run.mock.calls.some((c) => c[0][0] === "push")).toBe(false);
  });
});
