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
 * This function is a wrapper around the `dayjs()` function, which utilises the
 * same API as the legacy `moment` library.
 */
function date(input?: DateInput): DateReturnType {
	return dayjs(input);
}

export default date;
