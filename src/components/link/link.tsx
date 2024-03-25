import type { ComponentPropsWithoutRef, JSX } from 'react';

import Next$Link from 'next/link';

import merge from '~/styles/merge';

type Next$LinkProps = ComponentPropsWithoutRef<typeof Next$Link>;

/**
 * The `LinkVariant` is a string literal that determines the appearance of the
 * link component.
 */
export type LinkVariant = 'primary' | 'secondary' | 'opaque';

/**
 * The props for the `Link` component.
 */
export interface LinkProps extends Next$LinkProps {
	/**
	 * The `variant` property is a string literal which determines the appearance
	 * of the link.
	 *
	 * - `primary`: The primary variant is used for primary actions with a purple
	 *   text/foreground colour.
	 * - `secondary`: The secondary variant is used for secondary actions with a
	 *   black text/foreground colour.
	 * - `opaque`: The opaque variant is used for tertiary actions with a zinc
	 *   text/foreground colour.
	 *
	 * @default 'primary'
	 */
	variant?: LinkVariant;
}

/**
 * The `Link` is a React component that composes the link element, applying
 * the necessary styles and defining variants.
 *
 * @props {@link LinkProps}
 */
function Link({
	children,
	className,
	variant = 'primary',
	target = '_blank',
	...props
}: LinkProps): JSX.Element {
	return (
		<Next$Link
			{...props}
			data-variant={variant}
			target={target}
			className={merge(
				'transition-all',
				'data-[variant="primary"]:text-purple-500 dark:data-[variant="primary"]:text-purple-400',
				'hover:data-[variant="primary"]:text-purple-600 hover:dark:data-[variant="primary"]:text-purple-300',
				'data-[variant="secondary"]:text-black dark:data-[variant="secondary"]:text-white',
				'hover:data-[variant="secondary"]:text-zinc-900 hover:dark:data-[variant="secondary"]:text-zinc-200',
				'data-[variant="opaque"]:text-zinc-700 dark:data-[variant="opaque"]:text-zinc-400',
				'hover:data-[variant="opaque"]:text-zinc-800 hover:dark:data-[variant="opaque"]:text-zinc-200',
				className,
			)}
		>
			{children}
		</Next$Link>
	);
}

export default Link;
