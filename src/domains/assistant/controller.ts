import { type Message, useChat } from 'ai/react';
import { useMemo } from 'react';

import {
	useAssistantApiKey,
	useAssistantChatHistory,
	useAssistantChatSystem,
} from './store';

/**
 * A custom React hook that returns the controller for the assistant chat.
 */
export function useAssistantController() {
	const chatSystem = useAssistantChatSystem();
	const apiKey = useAssistantApiKey();
	const chatHistory = useAssistantChatHistory();

	const initialMessages = useMemo<Message[]>(
		() =>
			chatHistory.map(({ role, content }) => ({
				id: crypto.randomUUID(),
				role,
				content,
			})),
		[chatHistory],
	);

	const chatControl = useChat({
		api: `/api/chat${chatSystem ? `?system=${chatSystem}` : ''}`,
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
		initialMessages,
	});

	return chatControl;
}
