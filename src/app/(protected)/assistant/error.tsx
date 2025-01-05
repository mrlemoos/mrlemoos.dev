'use client';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import type { JSX } from 'react';

export default function PageError({ error }: { error: Error }): JSX.Element {
	const errorMessage = error.message;
	return (
		<div className='flex flex-col items-center justify-center h-full p-6'>
			<div className='flex items-center gap-2'>
				<ExclamationTriangleIcon
					className='size-6 text-red-500'
					aria-hidden='true'
				/>
				<h1 className='text-2xl font-bold'>Oops...</h1>
			</div>
			<p className='text-sm text-zinc-500 dark:text-zinc-400'>
				{`The assistant cannot be accessed because ${errorMessage}`}
			</p>
		</div>
	);
}
