import { getCollection } from "astro:content";
import { externalWriting } from "@/lib/data/external-writing";

export type WritingEntry = {
  kind: "local" | "external";
  title: string;
  description: string;
  href: string;
  date: Date;
  publisher?: string;
};

export async function getFeaturedWriting(limit = 4): Promise<WritingEntry[]> {
  const localPosts = await getCollection("blog");

  const local: WritingEntry[] = localPosts.map((post) => ({
    kind: "local",
    title: post.data.title,
    description: post.data.description,
    href: `/blog/${post.id}`,
    date: post.data.date,
  }));

  const external: WritingEntry[] = externalWriting.map((post) => ({
    kind: "external",
    title: post.title,
    description: post.description,
    href: post.url,
    date: post.date,
    publisher: post.publisher,
  }));

  return [...local, ...external]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
}
