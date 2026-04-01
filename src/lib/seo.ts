export const DEFAULT_TITLE = "Leonardo Lemos | Frontend Engineer";

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
  };
}

export function ogImageForPost(site: URL, title: string): string {
  const url = new URL("/og", site);
  url.searchParams.set("title", title);
  return url.href;
}
