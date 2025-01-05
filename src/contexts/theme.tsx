import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { JSX, ReactNode } from 'react';

export interface ThemeProviderProps {
	children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
	return (
		<NextThemeProvider enableColorScheme={true} defaultTheme='system'>
			{children}
		</NextThemeProvider>
	);
}
