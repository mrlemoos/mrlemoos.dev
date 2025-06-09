import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL, X_URL } from "@/lib/constants";
import { formatDate } from "@/lib/date";
import { mdxComponents } from "@/lib/mdx";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return {
    title: post?.title,
    description: post?.description,
    publisher: "Leonardo Lemos",
    authors: {
      name: "Leonardo Lemos",
      url: "https://mrlemoos.dev",
    },
    keywords: post?.tags,
    openGraph: {
      title: post?.title,
      description: post?.description,
      images: [{ url: `https://mrlemoos.dev/og?title=${post?.title}` }],
      publishedTime: post?.date ? new Date(post.date).toISOString() : undefined,
      modifiedTime: post?.date ? new Date(post.date).toISOString() : undefined,
      locale: "en-GB",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export async function generateStaticParams(): Promise<PageParams[]> {
  try {
    const posts = await getAllPosts();
    return posts.map(({ slug }) => ({ slug }));
  } catch (error) {
    console.error(
      "An error occurred at generateStaticParams() function in blog/[slug]. See the error:",
      error
    );
    return [];
  }
}

export default async function Page({
  params,
}: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="prose prose-lg mx-auto max-w-4xl px-4 py-8 lg:mt-[20dvh]">
      <h1 className="text-3xl font-bold text-center mb-2">{post.title}</h1>
      <p className="text-gray-500 text-center mb-8">{`Published on ${formatDate(
        post.date
      )}`}</p>
      <p className="text-gray-500">Leo writes:</p>
      <div className="prose prose-lg">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
      <span className="flex flex-col gap-1 pt-4">
        To everyone in this kingdom and beyond,
        <br />
        Cheers,
        <br />
        Leo
      </span>
      <div className="flex flex-col gap-4 mt-12 pt-8 border-t border-gray-200">
        <Link href="/" className="hover:underline">
          Liked it? Hated it and want to shout at me? Learn more about me here.
        </Link>
        <div className="flex flex-col gap-2">
          <span>Connect with me</span>
          <div className="flex flex-row gap-4">
            <Link href={LINKEDIN_URL} target="_blank">
              LinkedIn
            </Link>
            <Link href={X_URL} target="_blank">
              X
            </Link>
            <Link href={GITHUB_URL} target="_blank">
              GitHub
            </Link>
            <Link href={EMAIL_URL} target="_blank">
              Email
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
