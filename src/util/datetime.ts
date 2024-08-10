import dayjs from 'dayjs';

/**
 * The `DateInput` type defines the input type of the `date()` function.
 */
export type DateInput = dayjs.ConfigType;

/**
 * The `DateReturnType` type defines the return type of the `date()` function.
 */
export type DateReturnType = dayjs.Dayjs;

/**
 * The `date()` function creates a new date instance from the given input.
 *
 * This function is a wrapper around the `dayjs()` function,
 * which utilises the same API as the legacy `moment` library.
 *
 * @see https://day.js.org
 */
export function date(input?: DateInput): DateReturnType {
	return dayjs(input);
}

/**
 * Pads a time unit with leading zeros if necessary.
 * See the following example:
 *
 * ```ts
 * padTimeUnit(5); // '05'
 * ```
 */
export function padTimeUnit(time: number): string {
	return time.toString().padStart(2, '0');
}

/**
 * Formats the given number of seconds into a string representation of minutes
 * and seconds and returns the string in the format `mm:ss`.
 * An example of this function in use can be found below:
 *
 * ```ts
 * formatMinutesAndSeconds(65); // '01:05'
 * ```
 */
export function formatMinutesAndSeconds(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	return `${padTimeUnit(minutes)}:${padTimeUnit(remainingSeconds)}`;
}
