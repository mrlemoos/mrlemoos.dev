import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** When set, used for `article:modified_time` and JSON-LD `dateModified`. */
    updated: z.coerce.date().optional(),
    description: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
