import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  parsePostFile,
  serialisePostFile,
  type ParsedPostFile,
  type PostFrontmatter,
  type PostStatus,
} from "./frontmatter.ts";
import { BLOG_CONTENT_DIR, isSafeSlug, postRelativePath } from "./paths.ts";
import { isBodyLossless, roundTripBody } from "./lossless.ts";
import {
  extractTitleFromEditorMarkdown,
} from "./title-body.ts";
import { resolveSlugForSave } from "./slug.ts";

export type PostSummary = {
  slug: string;
  title: string;
  status: PostStatus;
  date: string;
  description: string;
  tracked: boolean;
};

export type LoadedPost = ParsedPostFile & {
  slug: string;
  relativePath: string;
  absolutePath: string;
  tracked: boolean;
  everLived: boolean;
};

function blogDir(repoRoot: string): string {
  return path.join(repoRoot, BLOG_CONTENT_DIR);
}

export async function listPosts(
  repoRoot: string,
  isTracked: (relativePath: string) => Promise<boolean>
): Promise<PostSummary[]> {
  const dir = blogDir(repoRoot);
  const entries = await readdir(dir);
  const posts: PostSummary[] = [];

  for (const name of entries) {
    if (!name.endsWith(".mdx")) continue;
    const slug = name.slice(0, -4);
    if (!isSafeSlug(slug)) continue;

    const relativePath = postRelativePath(slug);
    const raw = await readFile(path.join(dir, name), "utf8");
    const parsed = parsePostFile(raw);
    const tracked = await isTracked(relativePath);

    posts.push({
      slug,
      title: parsed.frontmatter.title,
      status: parsed.frontmatter.status,
      date: parsed.frontmatter.date,
      description: parsed.frontmatter.description,
      tracked,
    });
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function loadPost(
  repoRoot: string,
  slug: string,
  isTracked: (relativePath: string) => Promise<boolean>
): Promise<LoadedPost> {
  const relativePath = postRelativePath(slug);
  const absolutePath = path.join(repoRoot, relativePath);
  const raw = await readFile(absolutePath, "utf8");
  const parsed = parsePostFile(raw);
  const tracked = await isTracked(relativePath);

  return {
    ...parsed,
    slug,
    relativePath,
    absolutePath,
    tracked,
    everLived: tracked || parsed.frontmatter.status === "live",
  };
}

export type SavePostInput = {
  slug: string;
  proposedSlug?: string;
  editorMarkdown: string;
  description: string;
  tags: string[];
  date: string;
  updated?: string;
  status: PostStatus;
  create?: boolean;
};

export type SavePostResult =
  | { ok: true; slug: string; relativePath: string }
  | { ok: false; error: string };

export async function savePost(
  repoRoot: string,
  input: SavePostInput,
  isTracked: (relativePath: string) => Promise<boolean>
): Promise<SavePostResult> {
  const { title, body: diskBody } = extractTitleFromEditorMarkdown(
    input.editorMarkdown
  );

  if (!title.trim()) {
    return { ok: false, error: "Title is required (TipTap H1)" };
  }

  if (!isBodyLossless(diskBody)) {
    return {
      ok: false,
      error:
        "Save refused: TipTap cannot round-trip this Body losslessly (Body dialect v1 is CommonMark + GFM only)",
    };
  }

  // Prefer TipTap-normalised Body so disk matches what the Live Preview represents
  const normalisedBody = roundTripBody(diskBody);
  const finalBody =
    normalisedBody.trimEnd() === diskBody.trimEnd()
      ? diskBody.endsWith("\n")
        ? diskBody
        : `${diskBody}\n`
      : normalisedBody.endsWith("\n")
        ? normalisedBody
        : `${normalisedBody}\n`;

  let currentSlug = input.slug;
  let everLived = false;
  let existing: LoadedPost | null = null;

  if (!input.create) {
    existing = await loadPost(repoRoot, input.slug, isTracked);
    everLived = existing.everLived;
    currentSlug = existing.slug;
  }

  const nextSlug = resolveSlugForSave({
    currentSlug,
    proposedSlug: input.proposedSlug ?? input.slug,
    title,
    status: existing?.frontmatter.status ?? input.status,
    everLived,
  });

  const frontmatter: PostFrontmatter = {
    title: title.trim(),
    date: input.date,
    description: input.description,
    tags: input.tags,
    // Save never Publishes — new Posts are Draft; existing keep their Status
    status: input.create ? "draft" : (existing?.frontmatter.status ?? "draft"),
  };

  // Updated is stamped by Publish; Save keeps an existing value but does not
  // invent one for Drafts. Manual override is allowed only when already set or live.
  if (input.updated && frontmatter.status === "live") {
    frontmatter.updated = input.updated;
  } else if (existing?.frontmatter.updated) {
    frontmatter.updated = existing.frontmatter.updated;
  }

  const fileContents = serialisePostFile({
    frontmatter,
    body: finalBody,
  });

  const nextRelative = postRelativePath(nextSlug);
  const nextAbsolute = path.join(repoRoot, nextRelative);

  if (input.create) {
    try {
      await readFile(nextAbsolute, "utf8");
      return { ok: false, error: `A Post with Slug "${nextSlug}" already exists` };
    } catch {
      // does not exist — good
    }
    await writeFile(nextAbsolute, fileContents, "utf8");
    return { ok: true, slug: nextSlug, relativePath: nextRelative };
  }

  const currentAbsolute = path.join(repoRoot, postRelativePath(currentSlug));

  if (nextSlug !== currentSlug) {
    await writeFile(nextAbsolute, fileContents, "utf8");
    await unlink(currentAbsolute);
  } else {
    await writeFile(currentAbsolute, fileContents, "utf8");
  }

  return { ok: true, slug: nextSlug, relativePath: nextRelative };
}

export async function deleteDraftPost(
  repoRoot: string,
  slug: string,
  isTracked: (relativePath: string) => Promise<boolean>
): Promise<{ relativePath: string; title: string; tracked: boolean }> {
  const post = await loadPost(repoRoot, slug, isTracked);
  if (post.frontmatter.status !== "draft") {
    throw new Error("Only Draft Posts can be deleted from Local Admin");
  }
  await unlink(post.absolutePath);
  return {
    relativePath: post.relativePath,
    title: post.frontmatter.title,
    tracked: post.tracked,
  };
}

export function todayDateString(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}
