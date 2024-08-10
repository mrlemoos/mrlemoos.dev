'use client';

import { useEffect, type JSX, type FocusEvent as ReactFocusEvent } from 'react';

import {
	InfoCircledIcon,
	PauseIcon,
	PlayIcon,
	ResetIcon,
} from '@radix-ui/react-icons';

import Button from '~/components/button/button';
import Tooltip from '~/components/tooltip/tooltip';
import { fontMono } from '~/styles/fonts';
import merge from '~/styles/merge';
import { formatMinutesAndSeconds } from '~/util/datetime';
import { setDocumentTitle } from '~/util/html';

import { DOCUMENT_TITLE } from './constants';
import { useCountdownEventHandlers } from './hooks';

function canResetCountdown(
	currentSeconds: number,
	initialSeconds: number,
	isActive: boolean,
): boolean {
	if (currentSeconds === 0) {
		return true;
	}

	return !isActive && currentSeconds !== initialSeconds;
}

function canPauseCountdown(currentSeconds: number, isActive: boolean): boolean {
	return currentSeconds > 0 && isActive;
}

function canStartCountdown(
	currentSeconds: number,
	initialSeconds: number,
	isActive: boolean,
): boolean {
	return currentSeconds > 0 && !isActive && currentSeconds === initialSeconds;
}

function canResumeCountdown(
	currentSeconds: number,
	initialSeconds: number,
	isActive: boolean,
): boolean {
	return currentSeconds > 0 && !isActive && currentSeconds !== initialSeconds;
}

function canEditPeriod(
	currentSeconds: number,
	initialSeconds: number,
	isActive: boolean,
): boolean {
	return currentSeconds === initialSeconds && !isActive;
}

export function Timer(): JSX.Element {
	const {
		handlePauseTimer,
		handleResetTimer,
		handleStartTimer,
		handleResumeTimer,
		handleChangePeriod,
		initialSeconds,
		seconds,
		isActive,
	} = useCountdownEventHandlers();

	const visualCountdown = formatMinutesAndSeconds(seconds);

	function handleEditPeriod(event: ReactFocusEvent<HTMLElement>) {
		if (!canEditPeriod(seconds, initialSeconds, isActive)) {
			return;
		}
		handleChangePeriod(event.target.textContent || '');
	}

	useEffect(() => {
		if (initialSeconds !== seconds && isActive) {
			setDocumentTitle(`(${visualCountdown}) ${DOCUMENT_TITLE}`);
		} else if (document.title !== DOCUMENT_TITLE) {
			setDocumentTitle(DOCUMENT_TITLE);
		}
	}, [initialSeconds, seconds, isActive, visualCountdown]);

	return (
		<div className='flex flex-col gap-5 justify-center items-center p-10'>
			<article className='text-5xl p-3'>
				<div className='flex justify-center'>
					<div className='bg-zinc-50 dark:bg-zinc-900 z-10 p-0.5 rounded-full'>
						<Tooltip content='You can edit by clicking and typing into the clock.'>
							<InfoCircledIcon
								aria-hidden='true'
								height={24}
								width={24}
								className='fill-background'
							/>
						</Tooltip>
					</div>
				</div>
				<time
					dateTime={visualCountdown}
					className={merge(
						fontMono.className,
						'border border-border/30 rounded-lg py-2 px-4 w-[12rem] transition-colors duration-300',
						isActive ? 'font-medium cursor-default' : 'font-normal cursor-text',
						seconds <= 60 && 'text-red-950 dark:text-red-50 dark:bg-red-900/10',
						seconds <= 45 &&
							'text-red-900 dark:text-red-100 dark:bg-red-900/20',
						seconds <= 30 &&
							'text-red-800 dark:text-red-200 dark:bg-red-900/30',
						seconds <= 20 &&
							'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40',
						seconds <= 10 &&
							'text-red-600 dark:text-red-500 bg-red-200 dark:bg-red-900/50',
					)}
					suppressContentEditableWarning={true}
					contentEditable={canEditPeriod(seconds, initialSeconds, isActive)}
					onBlur={handleEditPeriod}
				>
					{visualCountdown}
				</time>
			</article>
			<div className='flex items-center gap-5'>
				{canStartCountdown(seconds, initialSeconds, isActive) && (
					<Button onClick={handleStartTimer}>
						Start&nbsp;
						<PlayIcon
							aria-hidden='true'
							className='ml-1'
							height={18}
							width={18}
						/>
					</Button>
				)}
				{canResumeCountdown(seconds, initialSeconds, isActive) && (
					<Button onClick={handleResumeTimer}>
						Resume&nbsp;
						<PlayIcon
							aria-hidden='true'
							className='ml-1'
							height={18}
							width={18}
						/>
					</Button>
				)}
				{canPauseCountdown(seconds, isActive) && (
					<Button onClick={handlePauseTimer} variant='outline'>
						Pause&nbsp;
						<PauseIcon
							aria-hidden='true'
							className='ml-1'
							height={18}
							width={18}
						/>
					</Button>
				)}
				{canResetCountdown(seconds, initialSeconds, isActive) && (
					<Button onClick={handleResetTimer} variant='outline'>
						Reset&nbsp;
						<ResetIcon
							aria-hidden='true'
							className='ml-1'
							height={18}
							width={18}
						/>
					</Button>
				)}
			</div>
		</div>
	);
}
