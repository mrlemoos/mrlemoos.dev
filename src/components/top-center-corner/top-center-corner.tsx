import type { ComponentPropsWithoutRef, JSX } from 'react';

import merge from '~/styles/merge';

/**
 * The `TopCenterCornerProps` is an object that represents the props of the
 * `TopCenterCorner` React component.
 *
 * It allows the attributes from the `div` HTML element to be passed down to the
 * component and, therefore, its root element.
 */
export type TopCenterCornerProps = ComponentPropsWithoutRef<'div'>;

/**
 * The `TopCenterCorner` is a React component that positions its children at the
 * top center corner of the screen.
 *
 * @props {@link TopCenterCornerProps}
 */
function TopCenterCorner({
	children,
	className,
	...props
}: TopCenterCornerProps): JSX.Element {
	return (
		<div
			{...props}
			className={merge('fixed top-12 left-[50%] -translate-x-[50%]', className)}
		>
			{children}
		</div>
	);
}

export default TopCenterCorner;
