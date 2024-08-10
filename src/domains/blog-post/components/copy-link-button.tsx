'use client';

import type { ButtonHTMLAttributes, JSX } from 'react';

import Button from '~/components/button/button';
import { useClipboardEventHandler } from '~/hooks/clipboard';

/**
 * The `CopyLinkButtonProps` interface is an object that represents the props of
 * the `CopyLinkButton` React component.
 */
export interface CopyLinkButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	/**
	 * The `href` is a string that represents the URL of the page to be copied
	 * to the clipboard.
	 *
	 * This string must contain the full URL of the page, including the protocol
	 * (e.g., `https://`) and the domain (e.g., `example.com`).
	 */
	href: string;
}

/**
 * The `CopyLinkButton` is a React component that renders a button that copies
 * a link to the clipboard when clicked.
 *
 * @props {@link CopyLinkButtonProps}
 */
function CopyLinkButton({
	type = 'button',
	href,
	...props
}: CopyLinkButtonProps): JSX.Element {
	const handleCopyLinkToClipboard = useClipboardEventHandler();

	return (
		<div className='flex flex-col gap-3 sm:flex-row sm:items-center mb-3'>
			<span>
				<input
					readOnly={true}
					value={href}
					className='font-mono text-xs p-2 rounded-md bg-zinc-100 dark:bg-zinc-900 w-full cursor-default'
				/>
			</span>
			<Button
				onClick={handleCopyLinkToClipboard(href)}
				size='sm'
				variant='secondary'
				className='sm:max-w-56'
				type={type}
				{...props}
			>
				Copy Link
			</Button>
		</div>
	);
}

export default CopyLinkButton;
