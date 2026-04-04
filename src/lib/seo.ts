export const DEFAULT_TITLE =
  "Leonardo Lemos | Frontend engineer, architecture & the modern web";

/** Used in Open Graph `og:site_name` and title suffixes for articles. */
export const SITE_BRAND_NAME = "Leonardo Lemos" as const;

/** Matches `/og` ImageResponse in `src/pages/og.ts`. */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export function titleWithBrand(articleTitle: string): string {
  return `${articleTitle} | ${SITE_BRAND_NAME}`;
}

export const DEFAULT_DESCRIPTION =
  "I'm Leo: a frontend engineer focused on accessible, scalable interfaces, software architecture, and open source. Writing on design systems, Tailwind, Astro, and how we build for the long haul." as const;

/** Visible hero line; keep aligned with `DEFAULT_DESCRIPTION`. */
export const HERO_TAGLINE =
  "Frontend engineer, architecture enthusiast, and open-source contributor—building accessible, scalable web software." as const;

export const DEFAULT_KEYWORDS = [
  "Leonardo Lemos",
  "frontend engineer",
  "software architecture",
  "design systems",
  "Astro",
  "Tailwind CSS",
  "TypeScript",
  "open source",
  "mrlemoos",
  "web development",
] as const;

export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  /** Defaults to `index, follow` in the layout when omitted. */
  robots?: string;
  /** Single JSON-LD object (include `@context` / `@graph` as needed). */
  structuredData?: Record<string, unknown>;
}

const defaultOgPath = "/og";

export function buildPageMeta(
  site: URL,
  overrides: Partial<PageMeta> & { title?: string; description?: string } = {}
): PageMeta {
  const title = overrides.title ?? DEFAULT_TITLE;
  const description = overrides.description ?? DEFAULT_DESCRIPTION;
  const keywords = (overrides.keywords ?? [...DEFAULT_KEYWORDS]) as string[];
  const ogImage =
    overrides.ogImage ??
    new URL(defaultOgPath, site).href;

  return {
    title,
    description,
    keywords,
    ogImage,
    articlePublishedTime: overrides.articlePublishedTime,
    articleModifiedTime: overrides.articleModifiedTime,
    robots: overrides.robots,
    structuredData: overrides.structuredData,
  };
}

export function ogImageForPost(site: URL, title: string): string {
  const url = new URL("/og", site);
  url.searchParams.set("title", title);
  return url.href;
}
