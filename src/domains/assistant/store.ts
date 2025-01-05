import { atomWithLocalStorage, useAtomValue, useSetAtom } from '~/lib/jotai';

const STORAGE_CHAT_HISTORY_KEY = 'mrl_chat_history' as const;
const STORAGE_CHAT_SYSTEM_KEY = 'mrl_chat_system' as const;
const STORAGE_API_KEY_KEY = 'mrl_api_key' as const;

export type ConversationRole = 'user' | 'assistant';

export interface ConversationChunk {
	role: ConversationRole;
	content: string;
}

/**
 * An atom that stores the assistant chat history in the local storage
 * and persists across sessions.
 *
 * @see {@link ConversationChunk}
 */
const assistantChatHistoryAtom = atomWithLocalStorage<ConversationChunk[]>(
	STORAGE_CHAT_HISTORY_KEY,
	[],
);

/**
 * An atom that stores the assistant chat system in the local storage
 * and persists across sessions.
 */
const assistantChatSystemAtom = atomWithLocalStorage<string>(
	STORAGE_CHAT_SYSTEM_KEY,
	'',
);

/**
 * An atom that stores the assistant API key in the local storage
 * and persists across sessions.
 */
const assistantApiKeyAtom = atomWithLocalStorage<string>(
	STORAGE_API_KEY_KEY,
	'',
);

/**
 * A custom React hook that returns the assistant chat history separated
 * by user and assistant messages.
 *
 * @see {@link ConversationChunk}
 */
export function useAssistantChatHistory(): ConversationChunk[] {
	const chatHistory = useAtomValue(assistantChatHistoryAtom);
	return chatHistory;
}

/**
 * A custom React hook that returns the handler functions to modify
 * the state of the assistant chat history.
 */
export function useAssistantChatHistoryHandlers() {
	const setChatHistory = useSetAtom(assistantChatHistoryAtom);
	const currentChatHistory = useAtomValue(assistantChatHistoryAtom);

	function appendMessage(message: ConversationChunk): void {
		setChatHistory([...currentChatHistory, message]);
	}

	function clearChatHistory(): void {
		setChatHistory([]);
	}

	return { appendMessage, clearChatHistory };
}

/**
 * A custom React hook that returns the assistant chat system.
 */
export function useAssistantChatSystem() {
	const chatSystem = useAtomValue(assistantChatSystemAtom);
	return chatSystem;
}

/**
 * A custom React hook that returns the handler functions to modify
 * the state of the assistant chat system.
 */
export function useAssistantChatSystemHandlers() {
	const setChatSystemAtom = useSetAtom(assistantChatSystemAtom);

	function setChatSystem(system: string): void {
		setChatSystemAtom(system);
	}

	return { setChatSystem };
}

/**
 * A custom React hook that returns the assistant API key.
 */
export function useAssistantApiKey() {
	const apiKey = useAtomValue(assistantApiKeyAtom);
	return apiKey;
}

/**
 * A custom React hook that returns the handler functions to modify
 * the state of the assistant API key.
 */
export function useAssistantApiKeyHandlers() {
	const setApiKeyAtom = useSetAtom(assistantApiKeyAtom);

	function setApiKey(apiKey: string): void {
		setApiKeyAtom(apiKey);
	}

	return setApiKey;
}
