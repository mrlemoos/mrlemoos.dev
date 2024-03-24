import type { ComponentPropsWithoutRef, JSX } from 'react';

import merge from '~/styles/merge';

/**
 * The `TopBarProps` is an object that represents the props of the `TopBar`
 * React component.
 *
 * It allows the attributes from the `header` HTML element to be passed down to
 * the component and, therefore, its root element.
 */
export type TopBarProps = ComponentPropsWithoutRef<'header'>;

/**
 * The `TopBar` is a React component that positions its children at the top of
 * the screen inside a semantic `header` HTML element.
 *
 * @props {@link TopBarProps}
 */
function TopBar({ children, className, ...props }: TopBarProps): JSX.Element {
	return (
		<header
			{...props}
			className={merge(
				'flex rounded-full bg-white/20 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-lg',
				'dark:bg-zinc-800/20 dark:text-zinc-200 dark:ring-white/10',
			)}
		>
			{children}
		</header>
	);
}

export default TopBar;
