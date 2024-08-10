import type { JSX, ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';
import colors from 'tailwindcss/colors';

import Paper from '~/components/paper/paper';
import Author from '~/constants/author';
import Footer from '~/domains/footer/footer';
import Header from '~/domains/header/header';
import { fontSans } from '~/styles/fonts';
import '~/styles/globals.css';
import merge from '~/styles/merge';

/**
 * The `viewport` object contains the viewport configuration of the website and
 * is handled by the Next.js framework. For more information, see the official
 * documentation:
 *
 * <https://nextjs.org/docs/app/api-reference/functions/generate-metadata#the-viewport-object>
 */
export const viewport: Viewport = {
	themeColor: [
		{
			media: '(prefers-color-scheme: light)',
			color: colors.zinc[50],
		},
		{
			media: '(prefers-color-scheme: dark)',
			color: colors.black,
		},
	],
};

/**
 * The `metadata` object contains the metadata of the website and is handled by
 * the Next.js framework. For more information, see the official documentation:
 *
 * <https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata>
 */
export const metadata: Metadata = {
	title: `Leo Lemos' website`,
	description:
		"Frontend engineer, software architecture enthusiast, and open-source contributor. I'm Leo, a frontend engineer with a passion for building accessible, scalable, and performant web applications. I thrive in environments where resilience and innovation are encouraged.",
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
	],
	creator: Author.NAME,
	publisher: Author.NAME,
};

/**
 * The props of the `Layout` component.
 */
interface LayoutProps {
	/**
	 * The page contents.
	 */
	children: ReactNode;
}

/**
 * The `Layout` is a React Server Component (RSC) that renders the layout form
 * of the website to be inherited by the whole application.
 *
 * @props {@link LayoutProps}
 */
function Layout({ children }: LayoutProps): JSX.Element {
	return (
		<html lang='en'>
			<body
				className={merge(
					fontSans.className,
					'bg-zinc-50 text-black dark:bg-black dark:text-white',
				)}
			>
				<Header />
				<main className='min-h-[100dvh]'>
					<Paper className='container mx-auto mt-[12vh] rounded-xl xl:max-w-5xl'>
						{children}
						<Footer />
					</Paper>
				</main>
			</body>
		</html>
	);
}

export default Layout;
