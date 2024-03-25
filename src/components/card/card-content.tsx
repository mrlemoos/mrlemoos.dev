import type { ComponentPropsWithoutRef, JSX } from 'react';

import { Slot } from '@radix-ui/react-slot';

import merge from '~/styles/merge';

/**
 * The props for the `CardContent` component.
 *
 * This interface extends the `div` HTML element attributes.
 */
export interface CardContentProps extends ComponentPropsWithoutRef<'div'> {
	/**
	 * The `asChild` property is a boolean that determines whether the component
	 * will forward the props to the first slottable child.
	 *
	 * @default false
	 */
	asChild?: boolean;
}

/**
 * The `CardContent` is a React component that composes the content of the card.
 *
 * This component is meant to be used with the `Card` component.
 *
 * @props {@link CardContentProps}
 */
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
