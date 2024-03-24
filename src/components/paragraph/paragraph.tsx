import type { ComponentPropsWithoutRef, JSX } from 'react';

import merge from '~/styles/merge';

export type ParagraphProps = ComponentPropsWithoutRef<'p'>;

function Paragraph({
	children,
	className,
	...props
}: ParagraphProps): JSX.Element {
	return (
		<p
			{...props}
			className={merge(
				'mt-6 text-base text-zinc-600 dark:text-zinc-400',
				className,
			)}
		>
			{children}
		</p>
	);
}

export default Paragraph;
