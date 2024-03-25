import useClipboard from './use-clipboard';

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
function useClipboardEventHandler(): UseClipboardEventHandler {
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

export default useClipboardEventHandler;
