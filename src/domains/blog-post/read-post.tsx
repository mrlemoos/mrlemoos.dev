import type { JSX } from 'react';

import {
	documentToReactComponents,
	type RenderNode,
} from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

import Badge from '~/components/badge/badge';
import Image from '~/components/image/image';
import Link from '~/components/link/link';
import Author from '~/constants/author';
import type BlogPostModel from '~/domains/blog-post/models/blog-post-model';
import env from '~/domains/environment/env';
import { date } from '~/util/datetime';
import getHttpProtocol from '~/util/get-http-protocol';

import CopyLinkButton from './components/copy-link-button';
import createBlogPostPath from './util/create-blog-post-path';

/**
 * @internal The `INSTAPAPER_URL` is a constant that represents the URL of the
 * 				   Instapaper website.
 */
const INSTAPAPER_URL = 'https://instapaper.com' as const;

/**
 * @internal The `renderNode` is an object that represents the render functions
 *  				 for the different types of nodes in the Contentful Rich Text JSON.
 *
 *           By default, Contentful's `documentToReactComponents` function does
 *           not know how to render embedded assets or entries. To render these
 *   				 types of nodes, you need to provide a `renderNode` object that
 *  				 contains the render functions for each type of node.
 */
const renderNode: RenderNode = {
	[BLOCKS.EMBEDDED_ASSET]: ({
		data: {
			target: {
				fields: {
					file: { url },
					title,
				},
			},
		},
	}) => {
		const timestamp = Date.now();
		const src = `https:${url}?timestamp=${timestamp}`;

		return (
			<Image
				// NOTE: The "?timestamp=${timestamp}" above is the only workaround to
				//       fix the issue with the `next/image` component not rendering the
				//       assets from Contentful. This is a known issue with the
				//       `next/image` component and a few remote Content Delivery
				//       Networks (CDNs) like Contentful's. It works on the local
				//       environment, however, when we deploy the changes to the Vercel
				//       cloud, the error occurs. The following discussion on GitHub
				//       explains the problem and the workaround:
				//       https://github.com/vercel/next.js/discussions/20138
				src={src}
				alt={title}
				width={600}
				height={480}
				priority={true}
				quality={100}
				className='mb-6'
			/>
		);
	},
};

/**
 * @internal The `DOCUMENT_TO_REACT_COMPONENTS_OPTIONS` is an object that
 *           represents the options for the `documentToReactComponents`
 *           function.
 */
const DOCUMENT_TO_REACT_COMPONENTS_OPTIONS = {
	renderNode,
} as const;

/**
 * The `ReadPostProps` is an object that represents the props of the `ReadPost`
 * React component.
 */
export interface ReadPostProps
	extends Omit<BlogPostModel, 'id' | 'description'> {}

/**
 * @internal The `createPostURL()` function is a utility function that creates
 *  				 the URL of a blog post based on its slug.
 *
 *           The produced URL is a full URL that includes the protocol, domain,
 *   				 and path of the blog post. This value is created on the server side
 *           because the protocol and domain are not available on the client
 *           since the client does not have access to the server environment.
 */
function createPostURL(slug: string) {
	const protocol = getHttpProtocol();
	const domain = env('VERCEL_URL');
	const pathname = createBlogPostPath(slug);

	const postURL = `${protocol}://${domain}${pathname}`;

	return postURL;
}

/**
 * The `ReadPost` is a React Server Component that renders a full blog post with
 * the title, content, and metadata.
 *
 * @props {@link ReadPostProps}
 */
function ReadPost({
	content,
	createdAt,
	tags,
	title,
	slug,
}: ReadPostProps): JSX.Element {
	const postURL = createPostURL(slug);

	return (
		<div className='max-w-2xl'>
			<h1 className='text-center font-medium text-3xl mb-2'>{title}</h1>
			<div className='flex items-center justify-center gap-x-4 mb-6'>
				<p className='dark:text-slate-400 text-slate-500 text-xs'>
					Posted on&nbsp;
					<time dateTime={date(createdAt).format('YYYY-MM-DD')}>
						{date(createdAt).format('MMMM D, YYYY')}
					</time>
					&nbsp;by {Author.NAME}
				</p>
				<div className='flex items-center gap-x-2'>
					{tags.map((tag) => (
						<Badge key={tag} variant='secondary'>
							{tag}
						</Badge>
					))}
				</div>
			</div>
			<div className='[&>p]:mb-8 [&>h2]:font-extrabold'>
				{documentToReactComponents(
					content,
					DOCUMENT_TO_REACT_COMPONENTS_OPTIONS,
				)}
			</div>
			<div className='flex flex-col sm:flex-row sm:items-center gap-3'>
				<span>
					<span className='font-medium'>Like this post?</span>
					&nbsp;Share it with your friends! 😃
				</span>
				<CopyLinkButton href={postURL}>Copy URL</CopyLinkButton>
			</div>
			<span>
				Want to read it later? I recommend&nbsp;
				<Link href={INSTAPAPER_URL} target='_blank'>
					Instapaper
				</Link>
				!
			</span>
		</div>
	);
}

export default ReadPost;
