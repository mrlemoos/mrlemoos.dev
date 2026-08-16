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
      link: `/blog/${id}`,
      ...(data.tags.length > 0 ? { categories: data.tags } : {}),
    }));
}
