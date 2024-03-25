import type { JSX } from 'react';

import Link from '~/components/link/link';
import Logo from '~/components/logo/logo';
import Tooltip from '~/components/tooltip/tooltip';
import TopBar from '~/components/top-bar/top-bar';
import TopBarButton from '~/components/top-bar/top-bar-button';
import TopBarNavigation from '~/components/top-bar/top-bar-navigation';
import TopCenterCorner from '~/components/top-center-corner/top-center-corner';

/**
 * The `Header` is a React component that composes the header section of the
 * application.
 */
function Header(): JSX.Element {
	return (
		<TopCenterCorner>
			<TopBar className='flex justify-between items-center'>
				<Tooltip
					content='Back to home'
					className='text-xs'
					isArrow={true}
					position='left-center'
				>
					<Link
						href='/'
						target='_self'
						className='cursor-pointer flex items-center mr-3'
					>
						<Logo size='sm' />
					</Link>
				</Tooltip>
				<TopBarNavigation>
					<TopBarButton href='/'>About</TopBarButton>
					<TopBarButton href='/posts'>Posts</TopBarButton>
					<TopBarButton href='/projects'>Projects</TopBarButton>
					<TopBarButton href='/stacks'>Stacks</TopBarButton>
				</TopBarNavigation>
			</TopBar>
		</TopCenterCorner>
	);
}

export default Header;
