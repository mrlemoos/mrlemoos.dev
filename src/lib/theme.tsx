"use client";

import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";
import type { JSX, ReactNode } from "react";

export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];

export interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * A provider to wrap the app in to enable the theme according to the system preference.
 *
 * @example
 * <ThemeProvider>{children}</ThemeProvider>
 */
export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  return (
    <NextThemeProvider enableSystem={true} defaultTheme={THEME_MODES.SYSTEM}>
      {children}
    </NextThemeProvider>
  );
}

export interface UseThemeReturnType {
  setTheme(theme: ThemeMode): void;
  theme: ThemeMode;
}

/**
 * A hook to get the current theme and set the theme.
 *
 * @example
 * const { theme, setTheme } = useTheme();
 *
 * @returns The current theme and a function to set the theme.
 */
export function useTheme(): UseThemeReturnType {
  const { setTheme, theme } = useNextTheme();
  return { setTheme, theme: theme as ThemeMode };
}
