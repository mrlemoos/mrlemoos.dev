import type { ComponentPropsWithoutRef, JSX } from 'react';

import merge from '~/styles/merge';

export type CardDatetimeProps = ComponentPropsWithoutRef<'div'>;

/**
 * The `CardDatetime` component composes the text for the card's datetime.
 *
 * This component is meant to be used with the `Card` component.
 *
 * @props {@link CardDatetime}
 */
function CardDatetime({
	children,
	className,
	...props
}: CardDatetimeProps): JSX.Element {
	return (
		<span
			{...props}
			className={merge('pl-4 border-l border-l-gray-500 text-xs', className)}
		>
			{children}
		</span>
	);
}

export default CardDatetime;
