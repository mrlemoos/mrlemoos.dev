import type { JSX } from 'react';

import Homepage from '~/domains/homepage/homepage';

/**
 * The `Page` is a top-level Next.js React Server Component (RSC) that renders
 * the homepage of the website.
 */
function Page(): JSX.Element {
	return <Homepage />;
}

export default Page;
