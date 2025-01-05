import type { JSX } from 'react';

import { Chat } from '~/domains/assistant/chat';
import env from '~/domains/environment/env';

const internalAPIKey = env('INTERNAL_API_KEY');
const hasInternalAPIKeyOnServer = !!internalAPIKey;

export const dynamic = 'force-dynamic';

export default function Page(): JSX.Element {
	if (!hasInternalAPIKeyOnServer) {
		throw new Error('the internal API key is not set.');
	}

	return (
		<div className='container mx-auto'>
			<Chat />
		</div>
	);
}
