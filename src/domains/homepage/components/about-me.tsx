import { Fragment, type JSX } from 'react';

import Link from '~/components/link/link';
import Paragraph from '~/components/paragraph/paragraph';
import GitHub from '~/constants/github';

const REACT_PROJECT_URL = 'https://react.dev' as const;
const NEXTJS_PROJECT_URL = 'https://nextjs.org' as const;
const TAILWINDCSS_PROJECT_URL = 'https://tailwindcss.com' as const;

/**
 * The `AboutMe` is a React Server Component (RSC) that renders a brief
 * description about me.
 */
function AboutMe(): JSX.Element {
	return (
		<Fragment>
			<Paragraph>
				I&apos;m Leo, a frontend engineer with a passion for building
				accessible, scalable, and performant web applications. I thrive in
				environments where resilience and innovation are encouraged.
			</Paragraph>
			<Paragraph>
				I am big fan of open-source projects such as&nbsp;
				<Link href={REACT_PROJECT_URL}>React</Link>,&nbsp;
				<Link href={NEXTJS_PROJECT_URL}>Next.js</Link>, and&nbsp;
				<Link href={TAILWINDCSS_PROJECT_URL}>TailwindCSS</Link>. By the way,
				this website is built with them. You can check the source code on&nbsp;
				<Link href={GitHub.REPOSITORY_URL} variant='secondary'>
					this GitHub page
				</Link>
				.
			</Paragraph>
		</Fragment>
	);
}

export default AboutMe;
