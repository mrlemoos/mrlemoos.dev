import { useEffect, useState } from 'react';

import { extractOnlyNumbers } from '~/util/strings';

/**
 * Custom hook for managing a countdown timer.
 *
 * It also is possible to include a customised initial number of seconds for
 * the countdown timer. Default is 5 minutes (5 * 60 seconds).
 *
 * This custom hook returns an object containing the current number of seconds,
 * and event handlers for starting, pausing, and resetting the timer.
 */
export function useCountdownEventHandlers() {
	const [initialSeconds, setInitialSeconds] = useState(5 * 60);
	const [seconds, setSeconds] = useState(initialSeconds);
	const [isActive, setActive] = useState(false);

	function handleStartTimer() {
		setActive(true);
	}

	function handleResumeTimer() {
		handleStartTimer();
	}

	function handlePauseTimer() {
		setActive(false);
	}

	function handleResetTimer() {
		setActive(false);
		setSeconds(initialSeconds);
	}

	function handleChangePeriod(textContent: string) {
		const rawValue = textContent.trim();

		if (!rawValue) {
			return;
		}

		const coercedValue =
			rawValue.includes(':') && [4, 5].includes(rawValue.length)
				? rawValue
				: `${rawValue}:00`;

		const [_rawMinutes, _rawSeconds] = coercedValue.split(':');
		const rawMinutes = extractOnlyNumbers(_rawMinutes);
		const rawSeconds = extractOnlyNumbers(_rawSeconds);

		const minutes = +rawMinutes;
		const seconds = +rawSeconds;

		const totalSeconds = minutes * 60 + seconds;

		setSeconds(totalSeconds);
		setInitialSeconds(totalSeconds);
	}

	useEffect(() => {
		if (!isActive || seconds === 0) {
			return;
		}

		const interval = setInterval(() => {
			setSeconds((seconds) => seconds - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [isActive, seconds]);

	return {
		seconds,
		handleStartTimer,
		handlePauseTimer,
		handleResetTimer,
		handleResumeTimer,
		handleChangePeriod,
		initialSeconds,
		isActive,
	};
}
