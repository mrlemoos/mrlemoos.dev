import type { PostStatus } from "./frontmatter.ts";

export function deriveSlugFromTitle(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function slugIsFrozen(input: {
  status: PostStatus;
  everLived: boolean;
}): boolean {
  return input.everLived;
}

export function resolveSlugForSave(input: {
  currentSlug: string;
  proposedSlug: string;
  title?: string;
  status: PostStatus;
  everLived: boolean;
}): string {
  if (slugIsFrozen(input)) {
    return input.currentSlug;
  }

  const proposed = input.proposedSlug.trim();
  if (proposed) {
    return deriveSlugFromTitle(proposed);
  }

  if (input.title) {
    return deriveSlugFromTitle(input.title);
  }

  return input.currentSlug;
}
