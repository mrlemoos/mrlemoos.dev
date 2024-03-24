import type { JSX } from 'react';

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
			<TopBar>
				<TopBarNavigation>
					<TopBarButton href='/' target='_blank'>
						About
					</TopBarButton>
					<TopBarButton href='/posts' target='_blank'>
						Posts
					</TopBarButton>
					<TopBarButton href='/projects' target='_blank'>
						Projects
					</TopBarButton>
					<TopBarButton href='/stacks' target='_blank'>
						Stacks
					</TopBarButton>
				</TopBarNavigation>
			</TopBar>
		</TopCenterCorner>
	);
}

export default Header;
