import type { ComponentPropsWithoutRef, JSX } from 'react';

import merge from '~/styles/merge';

/**
 * The `WildcardFooterProps` is an object that represents the props of the
 * `WildcardFooter` React component.
 *
 * It allows the attributes from the `footer` HTML element to be passed down to
 * the component and, therefore, its root element.
 */
export type WildcardFooterProps = ComponentPropsWithoutRef<'footer'>;

/**
 * The `WildcardFooter` is a React component that represents the footer section
 * of the wildcard layout.
 *
 * @props {@link WildcardFooterProps}
 */
function WildcardFooter({
	children,
	className,
	...props
}: WildcardFooterProps): JSX.Element {
	return (
		<footer
			{...props}
			className={merge(
				'p-5 w-full bg-white dark:bg-zinc-950 text-gray-500 border-t border-t-zinc-200 dark:border-t-zinc-900',
				className,
			)}
		>
			{children}
		</footer>
	);
}

export default WildcardFooter;
