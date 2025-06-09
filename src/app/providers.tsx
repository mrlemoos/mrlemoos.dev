import { ThemeProvider } from "@/lib/theme";
import type { JSX, ReactNode } from "react";

export interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): JSX.Element {
  return <ThemeProvider>{children}</ThemeProvider>;
}
