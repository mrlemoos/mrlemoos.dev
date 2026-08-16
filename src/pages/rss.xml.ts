import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  FEED_DESCRIPTION,
  FEED_PATH,
  FEED_TITLE,
  buildFeedItems,
  buildFeedMetadata,
} from "@/lib/rss";

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const site = context.site!;
  const items = buildFeedItems(await getCollection("blog"));

  return rss({
    title: FEED_TITLE,
    description: FEED_DESCRIPTION,
    site,
    items,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: buildFeedMetadata(new URL(FEED_PATH, site).href, items),
  });
};
