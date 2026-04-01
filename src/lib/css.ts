import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** At least ~48×48px hit area for PageSpeed tap-target and accessibility audits. */
export const socialNavLink = twMerge(
  "inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-md px-3 text-center",
  "underline decoration-zinc-400/60 underline-offset-[0.22em] transition-all duration-200 ease-out",
  "hover:-translate-y-px hover:text-foreground hover:decoration-foreground/80 motion-reduce:hover:translate-y-0",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:decoration-zinc-500/70 dark:hover:decoration-zinc-200/90"
);

export const socialNavRow = "flex flex-wrap items-center gap-3";

/** Inline text links (footer, prose-adjacent). */
export const textLink = twMerge(
  "rounded-sm text-muted-foreground underline decoration-zinc-400/50 underline-offset-[0.2em] transition-colors duration-200",
  "hover:text-foreground hover:decoration-foreground/70",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:decoration-zinc-600 dark:hover:decoration-zinc-400"
);

/** Blog listing cards: lift and border on hover. */
export const blogCardArticle = twMerge(
  "group rounded-xl border border-transparent bg-card/40 p-5 shadow-sm shadow-zinc-900/5 transition-all duration-300 ease-out",
  "hover:-translate-y-0.5 hover:border-border hover:shadow-md hover:shadow-zinc-900/10",
  "motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-sm",
  "dark:bg-card/30 dark:shadow-black/20 dark:hover:shadow-black/40"
);

export const blogCardTitle =
  "font-heading text-xl tracking-tight text-foreground transition-shadow duration-300";
