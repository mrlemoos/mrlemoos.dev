import { describe, expect, it } from "vitest";
import { parsePostFile, serialisePostFile } from "./frontmatter.ts";

describe("parsePostFile", () => {
  it("parses title, date, description, tags and Body", () => {
    const raw = `---
title: "Hello World"
date: "2026-01-15"
description: "A short note."
tags: ["blog", "astro"]
---

First paragraph.

## Heading

More text.
`;

    const post = parsePostFile(raw);

    expect(post.frontmatter).toEqual({
      title: "Hello World",
      date: "2026-01-15",
      description: "A short note.",
      tags: ["blog", "astro"],
      status: "live",
    });
    expect(post.body).toBe("First paragraph.\n\n## Heading\n\nMore text.\n");
  });

  it('defaults missing status to "live"', () => {
    const raw = `---
title: "Legacy"
date: "2025-06-01"
description: "Old post."
tags: ["blog"]
---

Body text.
`;

    expect(parsePostFile(raw).frontmatter.status).toBe("live");
  });

  it('parses explicit status "draft"', () => {
    const raw = `---
title: "WIP"
date: "2026-07-01"
description: "Not ready."
tags: ["blog"]
status: "draft"
---

Draft body.
`;

    expect(parsePostFile(raw).frontmatter.status).toBe("draft");
  });

  it("parses optional updated chronometer", () => {
    const raw = `---
title: "Updated post"
date: "2026-01-01"
updated: "2026-03-01"
description: "Changed."
tags: ["blog"]
status: "live"
---

Body.
`;

    expect(parsePostFile(raw).frontmatter.updated).toBe("2026-03-01");
  });
});

describe("serialisePostFile", () => {
  it("writes frontmatter and Body as an MDX file string", () => {
    const file = serialisePostFile({
      frontmatter: {
        title: "Hello World",
        date: "2026-01-15",
        description: "A short note.",
        tags: ["blog", "astro"],
        status: "draft",
      },
      body: "First paragraph.\n\n## Heading\n",
    });

    expect(file).toBe(`---
title: "Hello World"
date: "2026-01-15"
description: "A short note."
tags:
  - blog
  - astro
status: "draft"
---

First paragraph.

## Heading
`);
  });

  it("omits updated when unset", () => {
    const file = serialisePostFile({
      frontmatter: {
        title: "No update",
        date: "2026-01-01",
        description: "Plain.",
        tags: ["blog"],
        status: "live",
      },
      body: "Hi.\n",
    });

    expect(file).not.toContain("updated:");
  });

  it("includes updated when set", () => {
    const file = serialisePostFile({
      frontmatter: {
        title: "Has update",
        date: "2026-01-01",
        updated: "2026-02-01",
        description: "Plain.",
        tags: ["blog"],
        status: "live",
      },
      body: "Hi.\n",
    });

    expect(file).toContain('updated: "2026-02-01"');
  });

  it("round-trips parse then serialise for draft Posts", () => {
    const original = `---
title: "Round trip"
date: "2026-07-20"
description: "Check fidelity."
tags:
  - blog
status: "draft"
---

Paragraph one.

## Section

Paragraph two.
`;

    const parsed = parsePostFile(original);
    const again = serialisePostFile(parsed);
    const reparsed = parsePostFile(again);

    expect(reparsed.frontmatter).toEqual(parsed.frontmatter);
    expect(reparsed.body).toBe(parsed.body);
  });
});
