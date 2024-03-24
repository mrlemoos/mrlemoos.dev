import useClipboard from "./use-clipboard";

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

  function handleCopyToClipboard(value: string) {
    return () => copyToClipboard(value);
  }

  return handleCopyToClipboard
}

export default useClipboardEventHandler