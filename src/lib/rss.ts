import type { RSSFeedItem } from "@astrojs/rss";
import { filterLivePosts } from "./admin/public-filter.ts";
import type { PostStatus } from "./admin/frontmatter.ts";

type FeedPost = {
  id: string;
  data: {
    title: string;
    description: string;
    date: Date;
    tags: string[];
    status?: PostStatus | string | null;
  };
};

/** Feed title and description, also used for the `<link rel="alternate">` tag. */
export const FEED_TITLE = "Leonardo Lemos — blog";
export const FEED_DESCRIPTION =
  "Frontend engineering, design systems, and practical notes on building for the web.";
export const FEED_PATH = "/rss.xml";

/**
 * Turns blog entries into RSS items: live posts only, newest first.
 *
 * Links stay site-relative — `@astrojs/rss` resolves them against `site`.
 */
export function buildFeedItems(posts: FeedPost[]): RSSFeedItem[] {
  return filterLivePosts(posts)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map(({ id, data }) => ({
      title: data.title,
      description: data.description,
      // ponytail: `updated` deliberately ignored. pubDate is when the post first
      // appeared; rewriting it on an edit re-floats old posts in feed readers.
      pubDate: data.date,
      // Trailing slash matches the canonical the page declares and the URL in
      // the sitemap. Without it, readers attribute the item to a URL that
      // appears nowhere else in the site's own metadata.
      link: `/blog/${id}/`,
      ...(data.tags.length > 0 ? { categories: data.tags } : {}),
    }));
}

/**
 * Channel-level `customData`: the feed's own address (aggregators use it to
 * re-resolve a feed that has been copied or moved) and when it last changed.
 */
export function buildFeedMetadata(
  feedUrl: string,
  items: Pick<RSSFeedItem, "pubDate">[]
): string {
  const newest = items
    .map((item) => item.pubDate)
    .filter((date): date is Date => date instanceof Date)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return [
    "<language>en-gb</language>",
    `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
    // Dated from the newest post, not the build clock: a redeploy that changes
    // no posts shouldn't tell readers to poll again.
    ...(newest ? [`<lastBuildDate>${newest.toUTCString()}</lastBuildDate>`] : []),
  ].join("");
}
