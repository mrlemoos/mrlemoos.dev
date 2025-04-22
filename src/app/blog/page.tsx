import { formatDate } from "@/lib/date";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import type { JSX } from "react";

export default function Page(): JSX.Element {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-8">
        {posts.map(({ slug, title, date, description }) => (
          <article key={slug} className="border-b border-gray-200 pb-8">
            <Link href={`/blog/${slug}`}>
              <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600">
                {title}
              </h2>
            </Link>
            <p className="text-gray-600 mb-2">{formatDate(date)}</p>
            <p className="text-gray-700">{description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
