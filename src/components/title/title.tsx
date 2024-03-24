import type { ComponentPropsWithoutRef } from 'react';

import merge from '~/styles/merge';

export type TitleProps = ComponentPropsWithoutRef<'h1'>;

function Title({ children, className, ...props }: TitleProps): JSX.Element {
	return (
		<h1
			{...props}
			className={merge(
				'text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl lg:text-4xl dark:text-zinc-100',
				className,
			)}
		>
			{children}
		</h1>
	);
}

export default Title;
