import type { JSX } from 'react';

import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';

import LinkIcon from '~/components/link-icon/link-icon';
import WildcardFooter from '~/components/wildcard-footer/wildcard-footer';
import Author from '~/constants/author';
import CURRENT_YEAR from '~/constants/current-year';
import GitHub from '~/constants/github';
import LinkedIn from '~/constants/linked-in';

/**
 * The `Footer` is a React component that composes the footer section of the
 * application.
 */
function Footer(): JSX.Element {
	return (
		<WildcardFooter className='flex gap-y-3 px-8 pt-6 pb-10 flex-col-reverse sm:flex-row sm:justify-between items-center'>
			<span className='text-sm select-none pointer-events-none'>
				{Author.NAME} &copy; Copyright {CURRENT_YEAR}
			</span>
			<div className='flex items-center gap-x-1'>
				<LinkIcon href={GitHub.REPOSITORY_URL} target='_blank'>
					<GitHubLogoIcon
						className='w-5 h-5'
						aria-label='Go to project repository on GitHub'
					/>
				</LinkIcon>
				<LinkIcon href={LinkedIn.PROFILE_URL} target='_blank'>
					<LinkedInLogoIcon
						className='w-5 h-5'
						aria-label="Let's connect on LinkedIn"
					/>
				</LinkIcon>
			</div>
		</WildcardFooter>
	);
}

export default Footer;
