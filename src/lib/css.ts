import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Instant press feedback — respond on pointer-down, not release. */
export const interactivePress = twMerge(
  "transition-transform duration-100 ease-out",
  "active:scale-[0.97] motion-reduce:active:scale-100"
);

/** Apple-style translucent surfaces. */
export const materialThin = "material-thin";
export const materialRegular = "material-regular";

/** Section labels on translucent surfaces — slightly opened tracking. */
export const sectionEyebrow = twMerge(
  "font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] vibrancy-muted"
);

/** Large section headings — tight leading, negative tracking. */
export const sectionTitle = twMerge(
  "font-heading text-2xl leading-[1.1] tracking-[-0.025em] text-foreground md:text-3xl"
);

/** At least ~48×48px hit area for PageSpeed tap-target and accessibility audits. */
export const socialNavLink = twMerge(
  materialThin,
  interactivePress,
  "inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-full px-4 text-center text-sm font-medium",
  "text-foreground/80 no-underline transition-colors duration-150 ease-out",
  "hover:bg-[color-mix(in_oklab,var(--card)_55%,transparent)] hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
);

export const socialNavRow = "flex flex-wrap items-center gap-3";

/** Inline text links (footer, prose-adjacent). */
export const textLink = twMerge(
  interactivePress,
  "inline-flex items-center rounded-sm text-muted-foreground underline decoration-zinc-400/50 underline-offset-[0.2em] transition-colors duration-150",
  "hover:text-foreground hover:decoration-foreground/70",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:decoration-zinc-600 dark:hover:decoration-zinc-400"
);

/** Blog listing cards: glass material with press feedback. */
export const blogCardArticle = twMerge(
  materialRegular,
  interactivePress,
  "group block rounded-2xl p-5 text-inherit no-underline",
  "hover:border-[color-mix(in_oklab,var(--foreground)_12%,var(--material-border))]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
);

export const blogCardTitle =
  "font-heading text-xl tracking-tight text-foreground transition-shadow duration-300";

/** Hero featured-writing rows: editorial index inside glass surface. */
export const writingHighlightRow = twMerge(
  interactivePress,
  "group flex items-start gap-4 px-4 py-4 text-inherit no-underline transition-colors duration-150 md:px-5",
  "border-b border-[color-mix(in_oklab,var(--border)_55%,transparent)] last:border-b-0",
  "hover:bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
);

/** Experience and content panels on the homepage. */
export const contentPanel = twMerge(materialRegular, "overflow-hidden rounded-3xl");

/** Projects listing cards. */
export const projectCard = twMerge(
  "group relative block overflow-hidden rounded-2xl border border-border bg-card/30 p-6 text-inherit no-underline shadow-sm shadow-zinc-900/5 transition-all duration-300 ease-out",
  "hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md hover:shadow-zinc-900/10",
  "motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-sm",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:bg-card/20 dark:shadow-black/20 dark:hover:shadow-black/40"
);

export const projectStatusBadge = twMerge(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-medium uppercase tracking-wider"
);
