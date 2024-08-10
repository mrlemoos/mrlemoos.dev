import type { JSX } from 'react';

import type { Metadata } from 'next';

import Author from '~/constants/author';
import { DOCUMENT_TITLE } from '~/domains/timer/constants';
import { Timer } from '~/domains/timer/timer';

export const metadata: Metadata = {
	title: DOCUMENT_TITLE,
	description:
		"A simple timer to help you focus on your work and take breaks. It's a productivity tool to help you manage your time effectively.",
	applicationName: `${Author.NAME}' website`,
	authors: [
		{
			name: Author.NAME,
			url: new URL('https://mrlemoos.dev'),
		},
	],
	keywords: [
		'frontend',
		'engineer',
		'software',
		'tech',
		'technology',
		'architecture',
		'enthusiast',
		'open-source',
		'contributor',
		'leo',
		'mrlemoos',
		'mrlemoos.dev',
		'nextjs',
		'react',
		'tailwindcss',
		'typescript',
		'javascript',
		'web',
		'applications',
		'resilience',
		'innovation',
		'timer',
		'countdown',
		'pomodoro',
		'productivity',
		'focus',
		'work',
		'break',
		'interval',
		'alert',
		'notification',
		'audio',
		'visual',
		'vibration',
		'progress',
		'bar',
	],
	creator: Author.NAME,
	publisher: Author.NAME,
};

export default function Page(): JSX.Element {
	return (
		<div className='container mx-auto'>
			<h1 className='text-center text-3xl pt-10 font-bold'>Timer</h1>
			<h2 className='text-center text-lg pt-4 text-zinc-500'>
				<strong>Tip:</strong> You can type “5” and the timer will start a
				5-minute countdown.
			</h2>
			<Timer />
		</div>
	);
}
