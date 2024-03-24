import type { JSX } from 'react';

import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';

import LinkIcon from '~/components/link-icon/link-icon';
import GitHub from '~/constants/github';
import LinkedIn from '~/constants/linked-in';

/**
 * The `MyLinks` is a React Server Component (RSC) that renders the links to my
 * profiles on GitHub and LinkedIn in a meaningful and accessible way.
 */
function MyLinks(): JSX.Element {
	return (
		<div className='flex items-center gap-3 mt-8'>
			<LinkIcon
				href={GitHub.PROFILE_URL}
				tooltipContent='Click to go to my profile on GitHub'
			>
				<GitHubLogoIcon height={24} width={24} />
			</LinkIcon>
			<LinkIcon
				href={LinkedIn.PROFILE_URL}
				tooltipContent='Click to go to my profile on LinkedIn'
			>
				<LinkedInLogoIcon height={24} width={24} />
			</LinkIcon>
		</div>
	);
}

export default MyLinks;
