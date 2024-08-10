import type { JSX } from 'react';

import { ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import Card from '~/components/card/card';
import CardContent from '~/components/card/card-content';
import CardDatetime from '~/components/card/card-datetime';
import CardTitle from '~/components/card/card-title';
import { date } from '~/util/datetime';

import type BlogPostModel from './models/blog-post-model';
import createBlogPostPath from './util/create-blog-post-path';

/**
 * The `BlogPostCardProps` is an object that represents the props of the
 * `BlogPostCard` component.
 */
export interface BlogPostCardProps
	extends Pick<BlogPostModel, 'slug' | 'title' | 'createdAt' | 'description'> {}

/**
 * The `BlogPostCard` is a React component that renders a card for a blog post.
 *
 * @props {@link BlogPostCardProps}
 */
function BlogPostCard({
	title,
	description,
	createdAt,
	slug,
}: BlogPostCardProps): JSX.Element {
	const href = createBlogPostPath(slug);

	return (
		<Card className='relative cursor-pointer'>
			<CardDatetime>{date(createdAt).format('MMMM D, YYYY')}</CardDatetime>
			<CardTitle>{title}</CardTitle>
			<CardContent>{description}</CardContent>
			<div
				className='mt-4 flex items-center text-sm font-medium text-purple-500'
				aria-hidden='true'
			>
				Read article
				<ChevronRightIcon height={16} width={16} aria-hidden='true' />
			</div>
			<Link
				href={href}
				target='_self'
				className='z-10 absolute -inset-3'
				aria-label='Click to read the full post'
				prefetch={true}
			/>
		</Card>
	);
}

export default BlogPostCard;
