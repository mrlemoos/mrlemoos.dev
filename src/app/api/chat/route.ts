import { streamText } from 'ai';

import env from '~/domains/environment/env';
import { model } from '~/lib/http/services/openai';

// The API key to be included in the request headers to authenticate
const INTERNAL_API_KEY = env('INTERNAL_API_KEY');

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * The `POST` function is the entry point for the API route.
 * It handles the request and returns a stream of text to be handled by the client side.
 */
export async function POST(
	request: Request,
	{
		searchParams,
	}: {
		searchParams: { system: string };
	},
): Promise<Response> {
	const { messages } = await request.json();

	const headers = request.headers;
	const authorization = headers.get('Authorization');

	if (!authorization) {
		return new Response('Unauthorized', { status: 401 });
	}

	const apiKey = authorization.replace('Bearer ', '');

	if (apiKey !== INTERNAL_API_KEY) {
		return new Response('Unauthorized', { status: 401 });
	}

	const result = streamText({
		model,
		system: searchParams?.system,
		messages,
	});

	return result.toDataStreamResponse({
		getErrorMessage: (error) => {
			if (error == null) {
				return 'unknown error';
			}

			if (typeof error === 'string') {
				return error;
			}

			if (error instanceof Error) {
				return error.message;
			}

			return JSON.stringify(error);
		},
	});
}
