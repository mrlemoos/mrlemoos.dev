import type { JSX } from 'react';

import Image from 'next/image';

import CURRENT_YEAR from '~/constants/current-year';

/**
 * The `WorkExperienceYear` type is a string representation of a year.
 */
export type WorkExperienceYear = `${number}`;

/**
 * The props for the `WorkExperienceTile` component.
 */
export interface WorkExperienceTileProps {
	imageURL: string;
	companyName: string;
	position: string;
	startYear: WorkExperienceYear;
	endYear: WorkExperienceYear | 'Present';
}

/**
 * The `WorkExperienceTile` is a React component that displays a single work
 * experience entry.
 *
 * @props {@link WorkExperienceTileProps}
 */
function WorkExperienceTile({
	imageURL,
	companyName,
	position,
	startYear,
	endYear,
}: WorkExperienceTileProps): JSX.Element {
	const dateAriaLabel = endYear
		? `Since ${startYear}`
		: `${startYear} until ${endYear}`;

	return (
		<li className='flex gap-4'>
			<div className='relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0'>
				<Image
					src={imageURL}
					alt={companyName}
					height={32}
					width={32}
					className='w-7 h-7 text-transparent'
				/>
			</div>
			<dl className='flex flex-auto flex-wrap gap-x-2'>
				<dt className='sr-only'>Company</dt>
				<dd className='w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100'>
					{companyName}
				</dd>
				<dt className='sr-only'>Position</dt>
				<dd className='text-xs text-zinc-500 dark:text-zinc-400'>{position}</dd>
				<dt className='sr-only'>Date</dt>
				<dd
					className='ml-auto text-xs text-zinc-400 dark:text-zinc-500'
					aria-label={dateAriaLabel}
				>
					<time dateTime={startYear}>{startYear}</time>
					<span aria-hidden='true'>-</span>
					<time
						dateTime={endYear === 'Present' ? CURRENT_YEAR.toString() : endYear}
					>
						{endYear}
					</time>
				</dd>
			</dl>
		</li>
	);
}

export default WorkExperienceTile;
