import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

const postsDirectory = path.join(process.cwd(), "src/lib/posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  tags: string[];
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        content,
        tags: data.tags,
      };
    });

  return allPostsData.sort((left, right) => (left.date < right.date ? 1 : -1));
}

export interface GetHeadPostDto {
  limit?: number;
}

export function getHeadPosts({ limit = 3 }: GetHeadPostDto = {}): Post[] {
  return getAllPosts().slice(0, limit);
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      content,
      tags: data.tags,
    };
  } catch (error) {
    console.log(
      "[error] An error occurred while getPostBySlug() was called. Please check if the slug is correct. Here's the error:",
      error
    );
    return null;
  }
}
