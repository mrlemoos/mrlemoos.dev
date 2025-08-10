import { formatDate } from "@/lib/date";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import type { JSX } from "react";

interface BlogPostProps {
  slug: string;
  title: string;
  date: string;
  description: string;
}

/**
 * A blog post component that displays a blog post's title, date, and description.
 * @example
 * <BlogPost
 *  slug="my-first-post"
 *  title="My First Post"
 *  date="2021-01-01"
 *  description="This is my first post"
 * />
 */
function BlogPost({
  slug,
  title,
  date,
  description,
}: BlogPostProps): JSX.Element {
  return (
    <article className="mb-8">
      <Link href={`/blog/${slug}`}>
        <h3 className="font-semibold mb-1 hover:underline">{title}</h3>
      </Link>
      <p className="text-sm text-gray-500 mb-1">{formatDate(date)}</p>
      <p className="text-gray-500">{description}</p>
    </article>
  );
}

/**
 * A section displaying the latest blog posts.
 * It doesn't accept any props.
 *
 * @example
 * <BlogPosts />
 */
export async function BlogPosts(): Promise<JSX.Element> {
  const posts = await getAllPosts();

  return (
    <section>
      <h2 className="text-lg font-bold mb-6">Latest Posts</h2>
      <div>
        {posts.map((post) => (
          <BlogPost key={post.slug} {...post} />
        ))}
        <Link
          href="/blog"
          className="text-sm text-gray-500 hover:text-gray-600"
        >
          View all posts →
        </Link>
      </div>
    </section>
  );
}
