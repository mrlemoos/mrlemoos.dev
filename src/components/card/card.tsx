import type { ComponentPropsWithoutRef, JSX } from 'react';

import merge from '~/styles/merge';

export type CardProps = ComponentPropsWithoutRef<'div'>;

function Card({ children, className, ...props }: CardProps): JSX.Element {
	return (
		<article
			{...props}
			className={merge(
				'flex flex-col gap-3 p-5 rounded-xl bg-transparent dark:hover:bg-zinc-900 hover:bg-zinc-100',
				className,
			)}
		>
			{children}
		</article>
	);
}

export default Card;
