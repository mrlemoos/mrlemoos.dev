import type { Message } from 'ai';
import type { JSX } from 'react';

import { Markdown } from '~/components/markdown/markdown';
import merge from '~/styles/merge';

export interface MessageEntryProps {
	message: Message;
}

export function MessageEntry({
	message: { role, content },
}: MessageEntryProps): JSX.Element {
	const isUser = role === 'user';

	return (
		<div className='flex flex-col gap-2'>
			<div
				className={merge(
					'flex flex-col gap-1',
					isUser ? 'items-end' : 'items-start',
				)}
			>
				<div className='text-sm font-medium capitalize text-purple-950 dark:text-emerald-400'>
					{role}
				</div>
				<div
					className={merge(
						'text-lg',
						isUser
							? 'text-gray-500 dark:text-zinc-300 opacity-70'
							: 'text-gray-700 dark:text-zinc-50',
					)}
				>
					<Markdown>{content}</Markdown>
				</div>
			</div>
		</div>
	);
}
