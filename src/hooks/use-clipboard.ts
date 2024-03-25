import { useState } from 'react';

/**
 * The `CopyToClipboardFn` is a function that copies a string to the clipboard.
 */
export type CopyToClipboardFunction = (value: string) => void;

/**
 * The `useClipboard()` function is a custom React hook that returns a tuple
 * with the `clipboard` value and the `copyToClipboard()` function.
 *
 * @example
 * ```ts
 * const [clipboard, copyToClipboard] = useClipboard();
 * ```
 */
function useClipboard(): [string, CopyToClipboardFunction] {
	const [clipboard, setClipboard] = useState('');

	/**
	 * The `copyToClipboard()` function is a callback function that copies the
	 * `value` to the clipboard.
	 */
	function copyToClipboard(value: string) {
		navigator.clipboard.writeText(value);
		setClipboard(value);
	}

	return [clipboard, copyToClipboard] as const;
}

export default useClipboard;
