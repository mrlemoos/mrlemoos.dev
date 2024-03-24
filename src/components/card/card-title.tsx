import type { ComponentPropsWithoutRef, JSX } from 'react';

import merge from '~/styles/merge';

export type CardTitleProps = ComponentPropsWithoutRef<'h2'>;

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
