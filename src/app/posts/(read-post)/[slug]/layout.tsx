import type { JSX, ReactNode } from 'react';

interface LayoutProps {
	children: ReactNode;
}

function Layout({ children }: LayoutProps): JSX.Element {
	return (
		<main className='min-h-screen p-24 flex justify-center'>{children}</main>
	);
}

export default Layout;
