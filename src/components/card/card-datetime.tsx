import type { ComponentPropsWithoutRef, JSX } from 'react';

import merge from '~/styles/merge';

export type CardDatetimeProps = ComponentPropsWithoutRef<'div'>;

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
