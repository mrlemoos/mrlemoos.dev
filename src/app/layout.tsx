import { Footer } from "@/components/footer";
import { cn } from "@/lib/css";
import { spaceMono } from "@/lib/fonts";
import { mergeMetadata } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import type { JSX, ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = mergeMetadata();

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={cn(
          "min-h-screen bg-background font-mono text-foreground antialiased",
          spaceMono.variable
        )}
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
