import type { Message } from 'ai';
import type { JSX } from 'react';

import merge from '~/styles/merge';
import { MessageEntry } from './message-entry';

export interface MessageBoxProps {
	messages: Message[];
}

export function MessageBox({ messages }: MessageBoxProps): JSX.Element {
	const hasNoMessages = messages.length === 0;

	return (
		<div
			className={merge(
				'flex flex-col gap-2 px-6 my-6 bg-transparent rounded-md h-[50vh] overflow-y-auto',
			)}
		>
			{hasNoMessages ? (
				<div className='flex flex-col items-center justify-center h-full'>
					<p className='text-zinc-500 dark:text-zinc-400'>
						Chat history will appear here.
					</p>
				</div>
			) : (
				messages.map((message) => (
					<MessageEntry key={message.id} message={message} />
				))
			)}
		</div>
	);
}
