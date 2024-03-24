import type { ComponentPropsWithoutRef } from 'react';

import merge from '~/styles/merge';

export type PaperProps = ComponentPropsWithoutRef<'div'>;

function Paper({ children, className, ...props }: PaperProps): JSX.Element {
	return (
		<div {...props} className={merge('bg-white dark:bg-zinc-900', className)}>
			{children}
		</div>
	);
}

export default Paper;
