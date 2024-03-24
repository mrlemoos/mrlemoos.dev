import type { JSX } from 'react';

import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import Author from '~/constants/author';
import type BlogPostModel from '~/domains/blog-post/models/blog-post-model';
import ReadPost from '~/domains/blog-post/read-post';
import createRemoteCMSRepository from '~/domains/remote-cms/create-remote-cms-repository';

/**
 * The `PageParams` interface maps the parameters that compose the URL path of
 * the page.
 */
interface PageParams {
	/**
	 * The slug of the blog post which will be rendered on the page.
	 */
	slug: string;
}

/**
 * The instance of the remote Content Management System (CMS) repository.
 */
const repo = createRemoteCMSRepository();

interface GenerateMetadataProps {
	params: PageParams;
}

/**
 * The `generateMetadata()` function is a function handled by Next.js at the
 * build time to generate the metadata for the blog post pages.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata
 */
export async function generateMetadata(
	{ params: { slug } }: GenerateMetadataProps,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const blogPost = await fetchBlogPostOrReturnNil(slug);

	if (!blogPost) {
		return {};
	}

	const images = (await parent).openGraph?.images ?? [];
	const keywords = (await parent).keywords ?? [];

	const { title, description, tags, createdAt } = blogPost;

	const tagsOrKeywords = [...tags, ...keywords];

	return {
		title,
		description,
		keywords: tagsOrKeywords,
		authors: [
			{
				name: 'Leonardo Lemos',
				url: new URL('https://mrlemoos.dev'),
			},
		],
		openGraph: {
			images,
			type: 'article',
			description,
			tags: tagsOrKeywords,
			title,
			siteName: 'mrlemoos.dev',
			publishedTime: createdAt.toISOString(),
			locale: 'en_US',
			determiner: 'the',
		},
		assets: 'https://mrlemoos.dev/assets',
		applicationName: `${Author.NAME}' Tech Blog`,
		publisher: Author.NAME,
		robots: 'index, follow',
	};
}

/**
 * The `generateStaticParams()` function is a function handled by Next.js at the
 * build time to generate the static paths for the blog post pages.
 *
 * When executed, the function asynchronously produces the static parameters for
 * the following path: `/posts/[slug]`.
 *
 * NOTE: This function may throw an error if the fetching of the blog post slugs
 * fails for any reason.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
	const blogPosts = await repo.fetchPostSlugs();

	return blogPosts;
}

/**
 * The `fetchBlogPostOrReturnNil()` function is a helper function that fetches a
 * blog post from the Content Management System (CMS) by its slug.
 *
 * If the blog post is not found by any reason, the function returns `null`.
 */
async function fetchBlogPostOrReturnNil(
	slug: string,
): Promise<BlogPostModel | null> {
	try {
		return await repo.fetchBlogPost(slug);
	} catch (error) {
		return null;
	}
}

interface PageProps {
	params: PageParams;
}

/**
 * The `Page` is a Next.js top level page component that renders the complete
 * blog post.
 *
 * @props {@link PageProps}
 */
async function Page({ params: { slug } }: PageProps): Promise<JSX.Element> {
	const blogPost = await fetchBlogPostOrReturnNil(slug);

	if (!blogPost) {
		return notFound();
	}

	const { title, createdAt, content, tags } = blogPost;

	return (
		<ReadPost
			content={content}
			title={title}
			createdAt={createdAt}
			slug={slug}
			tags={tags}
		/>
	);
}

export default Page;
