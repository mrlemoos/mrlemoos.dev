import type { JSX, ReactNode } from 'react';

interface LayoutProps {
	children: ReactNode;
}

function Layout({ children }: LayoutProps): JSX.Element {
	return (
		<main className='min-h-screen p-3 sm:p-8 md:p-16 lg:p-24 flex justify-center'>
			{children}
		</main>
	);
}

export default Layout;
