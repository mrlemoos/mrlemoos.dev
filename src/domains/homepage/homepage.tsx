import type { JSX } from 'react';

import Title from '~/components/title/title';
import MyExperience from '~/domains/my-experience/my-experience';

import BlogPosts from '../blog-post/blog-posts';

import AboutMe from './components/about-me';
import MyAvatar from './components/my-avatar';
import MyLinks from './components/my-links';

/**
 * The `Homepage` is a React Server Component (RSC) which composes the homepage
 * of the website.
 */
function Homepage(): JSX.Element {
	return (
		<div className='min-h-[96dvh] p-6 md:p-10'>
			<MyAvatar />
			<section className='xl:max-w-3xl'>
				<Title className='mb-3'>
					Frontend engineer, software architecture enthusiast, and open-source
					contributor.
				</Title>
				<AboutMe />
				<MyLinks />
			</section>
			<section className='mt-16 mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2'>
				<BlogPosts />
				<div className='space-y-10 lg:pl-16 xl:pl-24'>
					<MyExperience />
				</div>
			</section>
		</div>
	);
}

export default Homepage;
