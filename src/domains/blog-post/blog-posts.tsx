import type { JSX } from 'react';

import createRemoteCMSRepository from '~/domains/remote-cms/create-remote-cms-repository';

import BlogPostCard from './blog-post-card';

const repo = createRemoteCMSRepository();

/**
 * The `BlogPosts` is a React Server Component (RSC) which fetches all blog
 * posts from the remote Content Management System (CMS) and renders a list of
 * the blog posts.
 */
async function BlogPosts(): Promise<JSX.Element> {
	const blogPosts = await repo.fetchBlogPosts();

	return (
		<div className='flex flex-col gap-16'>
			{blogPosts.map(({ description, id, createdAt, title, slug }) => (
				<BlogPostCard
					key={id}
					description={description}
					createdAt={createdAt}
					title={title}
					slug={slug}
				/>
			))}
		</div>
	);
}

export default BlogPosts;
