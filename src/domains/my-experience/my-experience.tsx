import type { JSX } from 'react';

import { BackpackIcon } from '@radix-ui/react-icons';

import WorkExperienceTile from './components/work-experience-tile';

/**
 * The `MyExperience` is a React component that displays the work experience of
 * the author.
 */
function MyExperience(): JSX.Element {
	return (
		<div className='rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40'>
			<h2 className='flex text-sm font-semibold text-zinc-900 dark:text-zinc-100'>
				<BackpackIcon height={24} width={24} />
				<span className='ml-3'>Experience</span>
			</h2>
			<ul className='mt-6 space-y-4'>
				<WorkExperienceTile
					imageURL='/assets/company-logos/bees.png'
					companyName='BEES (Anheuser-Busch InBev)'
					startYear='2022'
					endYear='Present'
					position='Frontend Software Engineer'
				/>
				<WorkExperienceTile
					imageURL='/assets/company-logos/smarten.png'
					companyName='Smarten Venture Builder'
					startYear='2020'
					endYear='2022'
					position='Frontend Developer'
				/>
			</ul>
		</div>
	);
}

export default MyExperience;
