import type { ComponentPropsWithoutRef, JSX } from 'react';

import { Slot } from '@radix-ui/react-slot';

import merge from '~/styles/merge';

export interface CardContentProps extends ComponentPropsWithoutRef<'div'> {
	asChild?: boolean;
}

function CardContent({
	children,
	className,
	asChild = false,
	...props
}: CardContentProps): JSX.Element {
	const RootElement = asChild ? Slot : 'div';

	return (
		<RootElement
			{...props}
			className={merge(
				'relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400',
				className,
			)}
		>
			{children}
		</RootElement>
	);
}

export default CardContent;
