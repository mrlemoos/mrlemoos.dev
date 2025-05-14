import { Geist, Space_Mono } from "next/font/google";

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const robotoMono = Geist({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
