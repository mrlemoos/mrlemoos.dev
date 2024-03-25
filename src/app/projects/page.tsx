import { randomUUID } from 'node:crypto';

import type { JSX } from 'react';

import { StarIcon } from '@radix-ui/react-icons';

import Link from 'next/link';
import Card from '~/components/card/card';
import CardContent from '~/components/card/card-content';
import CardTitle from '~/components/card/card-title';
import GitHub from '~/constants/github';
import env from '~/domains/environment/env';
import createGitHubRepository from '~/domains/github/create-github-repository';
import GitHubRepository from '~/domains/github/github-repository';
import GitHubPinnedRepositoryModel from '~/domains/github/models/github-pinned-repository-model';
import merge from '~/styles/merge';

const repo = createGitHubRepository(
	env('VERCEL_ENV') === 'development'
		? class GitHubRepositoryStub extends GitHubRepository {
				async fetchPinnedRepositories(
					_username: string,
				): Promise<GitHubPinnedRepositoryModel[]> {
					return await Promise.resolve([
						new GitHubPinnedRepositoryModel(
							randomUUID(),
							'planria',
							'A simple and minimalistic Scrum Planning platform for real Scrum teams',
							'https://github.com/mrlemoos/planria',
							1,
						),
						new GitHubPinnedRepositoryModel(
							randomUUID(),
							'louffee',
							'The way to connect students to housing abroad.',
							'https://github.com/louffee/louffee.co',
							1,
						),
					]);
				}
			}
		: undefined,
);

async function Page(): Promise<JSX.Element> {
	const projects = await repo.fetchPinnedRepositories(GitHub.USERNAME);

	return (
		<main className='max-w-2xl pt-16 md:pt-24 pb-10 mx-2 md:mx-auto min-h-screen'>
			<h1 className='text-2xl font-semibold'>Projects</h1>
			<p className='my-5 text-zinc-500'>
				Below are my open-source projects that I have worked on. Feel free to
				check them out and contribute if you are interested.
			</p>
			<ul
				className={merge(
					'flex flex-col',
					'[&_li]:list-none [&_li]:rounded-none',
					'rounded-t-xl rounded-b-xl overflow-hidden',
					'[&_li]:first:border-t [&_li]:last:border-b',
					'border border-zinc-300 dark:border-zinc-700',
				)}
			>
				{projects.map(({ id, name, description, remoteURL, stars }) => {
					const projectPathname = remoteURL.split('/').slice(-2).join('/');

					return (
						<Card asChild={true} key={id}>
							<li className='relative cursor-pointer'>
								<Link
									href={remoteURL}
									target='_blank'
									className='absolute inset-0 z-10'
									aria-label='Click to get redirected to the repository on GitHub'
								>
									<span className='sr-only'>
										Go to the repository on GitHub
									</span>
								</Link>
								<CardTitle>{name}</CardTitle>
								<CardContent>
									<p className='mb-3'>{description}</p>
									<div className='flex justify-between items-center'>
										<span className='flex items-center gap-x-1'>
											<StarIcon
												height={18}
												width={18}
												className='fill-yellow-400 dark:fill-yellow-100'
											/>
											{stars}
										</span>
										<span className='text-purple-500 dark:text-purple-400'>
											{projectPathname}
										</span>
									</div>
								</CardContent>
							</li>
						</Card>
					);
				})}
			</ul>
		</main>
	);
}

export default Page;
