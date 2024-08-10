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
export function useClipboard(): [string, CopyToClipboardFunction] {
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

/**
 * The `UseClipboardEventHandler` type defines a function that returns an event
 * handler that copies a string to the clipboard when called.
 */
export type UseClipboardEventHandler = (value: string) => () => void;

/**
 * The `useClipboardEventHandler()` function is a custom React hook that returns
 * the `copyToClipboard()` function from the `useClipboard()` hook wrapped in an
 * event handler.
 *
 * @example
 * ```ts
 * const copyToClipboard = useClipboardEventHandler();
 * ```
 */
export function useClipboardEventHandler(): UseClipboardEventHandler {
	const [, copyToClipboard] = useClipboard();

	/**
	 * The `handleCopyToClipboard()` function is an event handler that copies the
	 * given value to the clipboard when it is called.
	 *
	 * @example
	 * ```tsx
	 * import useClipboardEventHandler from '~/hooks/use-clipboard-event-handler';
	 *
	 * // ...
	 *
	 * const handleCopyToClipboard = useClipboardEventHandler();
	 *
	 * <button onClick={handleCopyToClipboard('Hello, World!')}>
	 *   Copy to Clipboard
	 * </button>
	 * ```
	 */
	function handleCopyToClipboard(value: string) {
		return () => copyToClipboard(value);
	}

	return handleCopyToClipboard;
}
