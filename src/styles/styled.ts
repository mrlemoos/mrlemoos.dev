import { cva, type VariantProps } from "class-variance-authority";

export type { VariantProps }

/**
 * The `styled()` function is a wrapper around the `cva()` function from the
 * `class-variance-authority` package. 
 * 
 * It generates and returns a function that, when called, provides a string with
 * the result CSS class names from the according variants passed as arguments.
 * 
 * The returned value is used to then style the elements.
 * 
 * @example
 * ```ts
 * const createRowStyles = styled('inline-flex', {
 *   variants: {
 *     direction: {
 *       row: 'flex-row',
 *       reverse: 'flex-col',
 *     },
 *   },
 * });
 * 
 * const className = createRowStyles({ direction: 'row' });
 * ```
 */
const styled = cva

export default styled
