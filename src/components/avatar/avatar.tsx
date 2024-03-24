import type { ComponentPropsWithoutRef, JSX } from 'react';

import Image from 'next/image';

import merge from '~/styles/merge';

/**
 * @internal The props from the `Image` component from Next.js
 */
type Next$ImageProps = Omit<
	ComponentPropsWithoutRef<typeof Image>,
	'height' | 'width' | 'children'
>;

/**
 * The props for the `Avatar` component.
 */
export interface AvatarProps extends Next$ImageProps {
	/**
	 * The number of pixels for the height and width of the avatar.
	 */
	size: number;
}

/**
 * The `Avatar` component is used to display a user's profile picture.
 *
 * @props {@link Avatar}
 */
function Avatar({
	src,
	alt,
	size,
	className,
	...props
}: AvatarProps): JSX.Element {
	return (
		<Image
			{...props}
			src={src}
			alt={alt}
			height={size}
			width={size}
			className={merge(
				'rounded-full ring-1 ring-purple-200 dark:ring-purple-950',
				className,
			)}
		/>
	);
}

export default Avatar;
