import type { JSX } from 'react';

import Avatar from '~/components/avatar/avatar';
import Link from '~/components/link/link';
import GitHub from '~/constants/github';

/**
 * The `MyAvatar` is a React Server Component (RSC) that renders my avatar photo
 * on GitHub in a meaningful and accessible way.
 */
function MyAvatar(): JSX.Element {
	return (
		<div className='w-16'>
			<Link href={GitHub.PROFILE_URL} target='_blank'>
				<Avatar
					src={GitHub.AVATAR_URL}
					alt='Leonardo Lemos photo on GitHub'
					size={64}
					quality={100}
					className='mb-16'
				/>
			</Link>
		</div>
	);
}

export default MyAvatar;
