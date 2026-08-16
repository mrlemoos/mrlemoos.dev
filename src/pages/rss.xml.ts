import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { FEED_DESCRIPTION, FEED_TITLE, buildFeedItems } from "@/lib/rss";

export const prerender = true;

export const GET: APIRoute = async (context) =>
  rss({
    title: FEED_TITLE,
    description: FEED_DESCRIPTION,
    site: context.site!,
    items: buildFeedItems(await getCollection("blog")),
    trailingSlash: false,
    customData: "<language>en-gb</language>",
  });
