import type { ComponentPropsWithoutRef, JSX } from 'react';

import Link from 'next/link';

import merge from '~/styles/merge';

/**
 * The `TopBarButtonProps` is an object that represents the props of the
 * `TopBarButton` React component.
 */
export type TopBarButtonProps = ComponentPropsWithoutRef<typeof Link>;

/**
 * The `TopBarButton` is a React component that represents a button which
 * encapsulates an anchor element from the Next.js' Link component.
 *
 * It is used to semantically declare a button that is part of the top bar.
 *
 * @props {@link TopBarButtonProps}
 */
function TopBarButton({
	children,
	className,
	href,
	target = '_self',
	...props
}: TopBarButtonProps): JSX.Element {
	return (
		<Link
			{...props}
			href={href}
			target={target}
			className={merge(
				'relative block px-3 py-2 transition hover:text-purple-900 hover:bg-purple-100',
			)}
		>
			{children}
		</Link>
	);
}

export default TopBarButton;
