import type { ComponentPropsWithoutRef, JSX } from 'react';

import merge from '~/styles/merge';

/**
 * The props for the `CardTitle` component.
 *
 * This component extends the `h2` HTML element attributes.
 */
export type CardTitleProps = ComponentPropsWithoutRef<'h2'>;

/**
 * The `CardTitle` is a React component that composes the title of the card.
 *
 * This component is meant to be used with the `Card` component.
 *
 * @props {@link CardTitleProps}
 */
function CardTitle({
	children,
	className,
	...props
}: CardTitleProps): JSX.Element {
	return (
		<h2
			{...props}
			className={merge(
				'text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100',
			)}
		>
			{children}
		</h2>
	);
}

export default CardTitle;
