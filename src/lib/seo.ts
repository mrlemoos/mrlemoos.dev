import merge from "lodash.merge";
import type { Metadata } from "next";
import type { PartialDeep } from "type-fest";

export const DEFAULT_TITLE = "Leonardo Lemos | Frontend Engineer";

export const DEFAULT_DESCRIPTION =
  "Frontend engineer, software architecture enthusiast, and open-source contributor. I'm Leo, a frontend engineer with a passion for building accessible, scalable, and performant web applications. I thrive in environments where resilience and innovation are encouraged." as const;

const defaultOpenGraph: NonNullable<Metadata["openGraph"]> = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  images: [
    {
      url: new URL("https://mrlemoos.dev/og"),
    },
  ],
};

const defaultMetadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  authors: [
    {
      name: "Leonardo Lemos",
      url: new URL("https://mrlemoos.dev"),
    },
  ],
  keywords: [
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
    "nextjs",
    "react",
    "tailwindcss",
    "typescript",
    "javascript",
    "web",
    "applications",
    "resilience",
    "innovation",
  ],
  creator: "Leonardo Lemos",
  publisher: "Leonardo Lemos",
  openGraph: defaultOpenGraph,
};

export function mergeMetadata(metadata: PartialDeep<Metadata> = {}): Metadata {
  return merge(defaultMetadata, metadata);
}
