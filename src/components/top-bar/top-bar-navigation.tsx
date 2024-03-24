import type { ComponentPropsWithoutRef, JSX } from 'react';

import merge from '~/styles/merge';

/**
 * The `TopBarNavigationProps` is an object that represents the props of the
 * `TopBarNavigation` React component.
 *
 * It allows the attributes from the `nav` HTML element to be passed down to the
 * component and, therefore, its root element.
 */
export type TopBarNavigationProps = ComponentPropsWithoutRef<'nav'>;

/**
 * The `TopBarNavigation` is a React component that represents the navigation
 * section of the top bar.
 *
 * It defines a semantic `nav` HTML element that positions its children in a
 * horizontal row.
 *
 * @props {@link TopBarNavigationProps}
 */
function TopBarNavigation({
	children,
	className,
	...props
}: TopBarNavigationProps): JSX.Element {
	return (
		<nav {...props} className={merge('flex gap-x-2', className)}>
			{children}
		</nav>
	);
}

export default TopBarNavigation;
