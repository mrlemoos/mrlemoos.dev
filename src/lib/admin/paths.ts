const SAFE_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSafeSlug(slug: string): boolean {
  return SAFE_SLUG_RE.test(slug);
}

export function postRelativePath(slug: string): string {
  if (!isSafeSlug(slug)) {
    throw new Error(`Invalid Slug: ${slug}`);
  }
  return `src/content/blog/${slug}.mdx`;
}

export const BLOG_CONTENT_DIR = "src/content/blog";
