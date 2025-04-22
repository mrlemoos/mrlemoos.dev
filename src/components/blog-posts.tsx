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

function BlogPost({
  slug,
  title,
  date,
  description,
}: BlogPostProps): JSX.Element {
  return (
    <article className="mb-8">
      <Link href={`/blog/${slug}`}>
        <h3 className="font-medium mb-1 hover:text-gray-600">{title}</h3>
      </Link>
      <p className="text-sm text-gray-500 mb-1">{formatDate(date)}</p>
      <p className="text-gray-700 text-sm">{description}</p>
    </article>
  );
}

export function BlogPosts(): JSX.Element {
  const posts = getAllPosts();

  return (
    <section>
      <h2 className="text-lg font-medium mb-6">Latest Posts</h2>
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
