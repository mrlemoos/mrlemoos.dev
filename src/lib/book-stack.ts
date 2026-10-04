/**
 * The /blog book stack: every post is a book lying flat in one pile. Its look
 * is derived from the slug so a book never changes shape between builds, and
 * nobody hand-picks it.
 */

export interface Book {
  /** Percent of the stack's width. */
  length: number;
  /** Index into the thickness steps in CSS (`data-thickness`). */
  thickness: number;
  /** Percent of the width the book leaves free, used as its left offset. */
  offset: number;
  /** Degrees the book is twisted in the pile, around the vertical axis. */
  tilt: number;
  /** Index into the tones in CSS (`data-tone`). */
  tone: number;
}

// FNV-1a: tiny, stable, spreads short slugs well enough.
function hash(input: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function bookFor(slug: string): Book {
  const h = hash(slug);
  return {
    length: 72 + (h % 29),
    thickness: (h >>> 5) % 3,
    offset: (h >>> 10) % 101,
    tilt: ((h >>> 17) % 9) - 4,
    tone: (h >>> 24) % 4,
  };
}

export function groupByYear<T extends { date: Date }>(posts: T[]) {
  const sorted = [...posts].sort((a, b) => b.date.getTime() - a.date.getTime());
  const groups: { year: number; posts: T[] }[] = [];
  for (const p of sorted) {
    const year = p.date.getUTCFullYear();
    const group = groups.at(-1);
    if (group?.year === year) group.posts.push(p);
    else groups.push({ year, posts: [p] });
  }
  return groups;
}
