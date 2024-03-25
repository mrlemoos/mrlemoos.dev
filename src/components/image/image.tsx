import type { ComponentPropsWithoutRef, JSX } from 'react';

import Next$Image from 'next/image';

import merge from '~/styles/merge';

type Next$ImageProps = ComponentPropsWithoutRef<typeof Next$Image>;

/**
 * The props for the `Image` component.
 */
export interface ImageProps extends Next$ImageProps {}

/**
 * The `Image` is a React component that composes the image element, applying
 * the necessary styles.
 *
 * @props {@link ImageProps}
 */
function Image({
	src,
	alt,
	width,
	height,
	priority,
	quality,
	className,
	...props
}: ImageProps): JSX.Element {
	return (
		<Next$Image
			{...props}
			src={src}
			alt={alt}
			width={width}
			height={height}
			priority={priority}
			quality={quality}
			className={merge(
				'w-full border border-zinc-300/30 dark:border-zinc-700/20 rounded-md',
				className,
			)}
		/>
	);
}

export default Image;
