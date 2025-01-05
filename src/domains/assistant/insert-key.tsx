'use client';

import { type JSX, type FormEvent as ReactFormEvent, useId } from 'react';

import Button from '~/components/button/button';
import { useAssistantApiKeyHandlers } from './store';

export function InsertKey(): JSX.Element {
	const setApiKey = useAssistantApiKeyHandlers();
	const inputId = useId();

	function handleSubmit(event: ReactFormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const apiKey = formData.get(inputId) as string;
		setApiKey(apiKey);
	}

	return (
		<div className='flex flex-col gap-2 p-4'>
			<h2 className='text-lg font-medium text-gray-900 dark:text-zinc-50'>
				Insert your API key
			</h2>
			<form onSubmit={handleSubmit}>
				<div className='flex items-center gap-2'>
					<input
						type='text'
						placeholder='Enter your API key...'
						className='w-full p-2 rounded-md border border-gray-300 dark:border-zinc-700'
						name={inputId}
					/>
					<Button type='submit'>Save</Button>
				</div>
			</form>
		</div>
	);
}
