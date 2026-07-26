import { parse as parseYaml } from "yaml";

export type PostStatus = "draft" | "live";

export type PostFrontmatter = {
  title: string;
  date: string;
  updated?: string;
  description: string;
  tags: string[];
  status: PostStatus;
};

export type ParsedPostFile = {
  frontmatter: PostFrontmatter;
  body: string;
};

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

function coerceDateString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return new Date(value).toISOString().slice(0, 10);
  }
  throw new Error("Invalid date value in frontmatter");
}

function normaliseStatus(value: unknown): PostStatus {
  if (value === "draft" || value === "live") {
    return value;
  }
  if (value === undefined || value === null) {
    return "live";
  }
  throw new Error(`Invalid status: ${String(value)}`);
}

export function parsePostFile(raw: string): ParsedPostFile {
  const match = FRONTMATTER_RE.exec(raw);
  if (!match) {
    throw new Error("Post file must start with YAML frontmatter");
  }

  const yamlBlock = match[1]!;
  let body = match[2] ?? "";
  if (body.startsWith("\n")) {
    body = body.slice(1);
  }
  const data = parseYaml(yamlBlock) as Record<string, unknown>;

  if (typeof data.title !== "string") {
    throw new Error("Post frontmatter requires a title string");
  }
  if (typeof data.description !== "string") {
    throw new Error("Post frontmatter requires a description string");
  }
  if (!Array.isArray(data.tags) || !data.tags.every((t) => typeof t === "string")) {
    throw new Error("Post frontmatter requires a tags string array");
  }

  const frontmatter: PostFrontmatter = {
    title: data.title,
    date: coerceDateString(data.date),
    description: data.description,
    tags: data.tags,
    status: normaliseStatus(data.status),
  };

  if (data.updated !== undefined && data.updated !== null) {
    frontmatter.updated = coerceDateString(data.updated);
  }

  return { frontmatter, body };
}

function quoteYamlString(value: string): string {
  return JSON.stringify(value);
}

function serialiseFrontmatter(fm: PostFrontmatter): string {
  const lines: string[] = [
    `title: ${quoteYamlString(fm.title)}`,
    `date: ${quoteYamlString(fm.date)}`,
  ];

  if (fm.updated) {
    lines.push(`updated: ${quoteYamlString(fm.updated)}`);
  }

  lines.push(`description: ${quoteYamlString(fm.description)}`);
  lines.push("tags:");
  for (const tag of fm.tags) {
    lines.push(`  - ${tag}`);
  }
  lines.push(`status: ${quoteYamlString(fm.status)}`);

  return lines.join("\n");
}

export function serialisePostFile(post: ParsedPostFile): string {
  const yaml = serialiseFrontmatter(post.frontmatter);
  const body = post.body.startsWith("\n") ? post.body.slice(1) : post.body;
  return `---\n${yaml}\n---\n\n${body}`;
}
