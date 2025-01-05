'use client';

import { Fragment, type JSX, type FormEvent as ReactFormEvent } from 'react';

import Button from '~/components/button/button';
import Textarea from '~/components/textarea/textarea';
import { useAssistantController } from './controller';
import { InsertKey } from './insert-key';
import { MessageBox } from './message-box';
import { useAssistantApiKey, useAssistantChatHistoryHandlers } from './store';

export function Chat(): JSX.Element {
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit: handleSubmitToAssistant,
		isLoading,
	} = useAssistantController();
	const apiKey = useAssistantApiKey();
	const { clearChatHistory } = useAssistantChatHistoryHandlers();
	const hasAPIKey = !!apiKey;

	function handleSubmit(event: ReactFormEvent<HTMLFormElement>) {
		handleSubmitToAssistant(event);
	}

	function handleClearHistory() {
		clearChatHistory();
	}

	return (
		<div className='flex flex-col gap-4'>
			{hasAPIKey ? (
				<Fragment>
					<MessageBox messages={messages} />
					<form onSubmit={handleSubmit} className='mt-5 px-3 pb-3'>
						<Textarea
							value={input}
							onChange={handleInputChange}
							placeholder='Type your message here...'
							className='min-h-20'
							disabled={isLoading}
						/>
						<div className='flex justify-end gap-3'>
							<Button variant='ghost' onClick={handleClearHistory}>
								Clear History
							</Button>
							<Button type='submit' className='w-[8ch]' disabled={isLoading}>
								{isLoading ? (
									<span className='animate-pulse text-inherit text-black dark:text-white tracking-wide'>
										...
									</span>
								) : (
									'Send'
								)}
							</Button>
						</div>
					</form>
				</Fragment>
			) : (
				<InsertKey />
			)}
		</div>
	);
}
