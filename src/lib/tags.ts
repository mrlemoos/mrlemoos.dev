import { deriveSlugFromTitle } from "./admin/slug.ts";
import { filterLivePosts } from "./admin/public-filter.ts";

/**
 * The shape a Post needs for tag grouping and relatedness — deliberately
 * looser than the content collection entry so the logic stays unit-testable.
 */
export interface TaggablePost {
  id: string;
  data: {
    date: Date;
    tags?: string[] | null;
    status?: string | null;
  };
}

export interface TagGroup<T extends TaggablePost = TaggablePost> {
  /** URL segment under `/blog/tags/`. */
  slug: string;
  /** Human-facing spelling: the most-used variant that maps to this slug. */
  label: string;
  /** Every original tag spelling that maps to this slug, in first-seen order. */
  tags: string[];
  /** Live Posts carrying any of those spellings, newest first. */
  posts: T[];
}

/**
 * Turns a tag into a URL segment: lower-case, accent-free, spaces to hyphens.
 * Returns an empty string when nothing URL-safe survives — such tags get no page.
 */
export function slugifyTag(tag: string): string {
  return deriveSlugFromTitle(tag);
}

function tagsOf(post: TaggablePost): string[] {
  return post.data.tags ?? [];
}

/** Distinct, non-empty tag slugs on a Post. */
function tagSlugsOf(post: TaggablePost): string[] {
  const slugs = new Set<string>();
  for (const tag of tagsOf(post)) {
    const slug = slugifyTag(tag);
    if (slug) {
      slugs.add(slug);
    }
  }
  return [...slugs];
}

function byDateDescThenId(a: TaggablePost, b: TaggablePost): number {
  const delta = b.data.date.getTime() - a.data.date.getTime();
  return delta !== 0 ? delta : (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

/**
 * Groups live Posts by tag slug. Two tags that slugify the same ("Tailwind CSS"
 * and "tailwind css") collapse into one group — one URL, one page, both
 * spellings recorded.
 */
export function groupPostsByTag<T extends TaggablePost>(
  posts: T[]
): TagGroup<T>[] {
  const groups = new Map<
    string,
    { slug: string; spellings: Map<string, number>; posts: Map<string, T> }
  >();

  for (const post of filterLivePosts(posts)) {
    for (const tag of tagsOf(post)) {
      const slug = slugifyTag(tag);
      if (!slug) {
        continue;
      }

      let group = groups.get(slug);
      if (!group) {
        group = { slug, spellings: new Map(), posts: new Map() };
        groups.set(slug, group);
      }

      group.spellings.set(tag, (group.spellings.get(tag) ?? 0) + 1);
      group.posts.set(post.id, post);
    }
  }

  return [...groups.values()]
    .map((group) => {
      const spellings = [...group.spellings.entries()];
      // Most-used spelling wins; ties break on code-point order for determinism.
      const label = spellings.reduce((best, entry) =>
        entry[1] > best[1] || (entry[1] === best[1] && entry[0] < best[0])
          ? entry
          : best
      )[0];

      return {
        slug: group.slug,
        label,
        tags: spellings.map(([tag]) => tag),
        posts: [...group.posts.values()].sort(byDateDescThenId),
      };
    })
    .sort(
      (a, b) =>
        b.posts.length - a.posts.length ||
        (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)
    );
}

export const RELATED_POSTS_LIMIT = 3;

/**
 * Picks Posts to read next.
 *
 * Relatedness is the sum of the shared tags' weights, where a tag weighs
 * `1 / (number of live Posts carrying it)`. Ubiquitous tags such as "blog"
 * therefore barely register, while a tag shared by only two Posts is a strong
 * signal. Ties — including the no-shared-tags case — fall back to most recent.
 * Drafts and the current Post are never candidates.
 */
export function selectRelatedPosts<T extends TaggablePost>(
  current: TaggablePost,
  posts: T[],
  limit: number = RELATED_POSTS_LIMIT
): T[] {
  const live = filterLivePosts(posts);

  const postsPerTagSlug = new Map<string, number>();
  for (const post of live) {
    for (const slug of tagSlugsOf(post)) {
      postsPerTagSlug.set(slug, (postsPerTagSlug.get(slug) ?? 0) + 1);
    }
  }

  const currentSlugs = new Set(tagSlugsOf(current));

  const scored = live
    .filter((post) => post.id !== current.id)
    .map((post) => ({
      post,
      score: tagSlugsOf(post).reduce(
        (total, slug) =>
          currentSlugs.has(slug)
            ? total + 1 / (postsPerTagSlug.get(slug) ?? 1)
            : total,
        0
      ),
    }));

  return scored
    .sort((a, b) => b.score - a.score || byDateDescThenId(a.post, b.post))
    .slice(0, Math.max(0, limit))
    .map(({ post }) => post);
}
