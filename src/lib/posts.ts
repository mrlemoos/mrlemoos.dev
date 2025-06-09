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

/**
 * A function returning all the posts in the posts directory.
 *
 * @example
 * const posts = await getAllPosts();
 */
export function getAllPosts(): Promise<Post[]> {
  return new Promise<Post[]>((resolve) => {
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

    resolve(
      allPostsData.sort((left, right) => (left.date < right.date ? 1 : -1))
    );
  });
}

export interface GetHeadPostDto {
  limit?: number;
}

/**
 * A function returning the top 3 posts by date.
 *
 * @example
 * const posts = await getHeadPosts();
 */
export async function getHeadPosts({ limit = 3 }: GetHeadPostDto = {}): Promise<
  Post[]
> {
  return await getAllPosts().then((posts) => posts.slice(0, limit));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return await new Promise<Post | null>((resolve) => {
    try {
      const fullPath = path.join(postsDirectory, `${slug}.mdx`);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      resolve({
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        content,
        tags: data.tags,
      });
    } catch (error) {
      console.log(
        "[error] An error occurred while getPostBySlug() was called. Please check if the slug is correct. Here's the error:",
        error
      );
      resolve(null);
    }
  });
}
