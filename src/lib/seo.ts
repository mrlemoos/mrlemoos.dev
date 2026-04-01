export const DEFAULT_TITLE = "Leonardo Lemos | Frontend Engineer";

/** Used in Open Graph `og:site_name` and title suffixes for articles. */
export const SITE_BRAND_NAME = "Leonardo Lemos" as const;

export function titleWithBrand(articleTitle: string): string {
  return `${articleTitle} | ${SITE_BRAND_NAME}`;
}

export const DEFAULT_DESCRIPTION =
  "Frontend engineer, software architecture enthusiast, and open-source contributor. I'm Leo, a frontend engineer with a passion for building accessible, scalable, and performant web applications. I thrive in environments where resilience and innovation are encouraged." as const;

export const DEFAULT_KEYWORDS = [
  "frontend",
  "engineer",
  "software",
  "tech",
  "technology",
  "architecture",
  "enthusiast",
  "open-source",
  "contributor",
  "leo",
  "mrlemoos",
  "mrlemoos.dev",
  "astro",
  "tailwindcss",
  "typescript",
  "javascript",
  "web",
  "applications",
  "resilience",
  "innovation",
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
