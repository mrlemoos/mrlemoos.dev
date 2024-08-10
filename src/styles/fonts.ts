import { Fira_Mono, Inter } from 'next/font/google';

export const fontSans = Inter({
	subsets: ['latin'],
});

export const fontMono = Fira_Mono({
	weight: ['500', '400'],
	subsets: ['latin'],
});
