'use client';

import type { ComponentPropsWithoutRef, JSX } from 'react';

import { Slot } from '@radix-ui/react-slot';

import merge from '~/styles/merge';

/**
 * The props for the `Card` component.
 */
export interface CardProps extends ComponentPropsWithoutRef<'div'> {
	/**
	 * The `asChild` prop is a boolean flag that determines if the card will
	 * forward the properties to the first slottable element.
	 *
	 * @default false
	 */
	asChild?: boolean;
}

/**
 * The `Card` is a React component that composes the card layout, acting as a
 * wrapper for the whole card.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardTitle>Card Title</CardTitle>
 *   <CardContent>Card Content</CardContent>
 * </Card>
 * ```
 *
 * @props {@link CardProps}
 */
function Card({
	children,
	className,
	asChild = false,
	...props
}: CardProps): JSX.Element {
	const RootElement = asChild ? Slot : 'article';

	return (
		<RootElement
			{...props}
			className={merge(
				'flex flex-col gap-3 p-5 rounded-xl bg-transparent dark:hover:bg-zinc-900 hover:bg-zinc-100',
				className,
			)}
		>
			{children}
		</RootElement>
	);
}

export default Card;
