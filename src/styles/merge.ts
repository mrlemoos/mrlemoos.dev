import { twMerge } from 'tailwind-merge';

/**
 * The `merge()` function combines the given classes into a single string,
 * trimming any falsy values.
 *
 * Under the hood, this function uses the `twMerge()` function from the
 * `tailwind-merge` package.
 */
function merge(...classes: (string | null | false | undefined)[]) {
	return twMerge(...classes.filter(Boolean));
}

export default merge;
