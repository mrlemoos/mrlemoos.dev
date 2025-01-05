'use client';

import { type TextareaHTMLAttributes, forwardRef } from 'react';
import merge from '~/styles/merge';

export interface TextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	function Textarea({ className, ...props }, forwardedRef) {
		return (
			<textarea
				ref={forwardedRef}
				className={merge(
					'w-full border border-gray-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 rounded-md p-4 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-500',
					className,
				)}
				{...props}
			/>
		);
	},
);

export default Textarea;
