import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Instant press feedback — respond on pointer-down, not release.
 *
 * The property list is explicit rather than `transition-colors` +
 * `transition-transform`: those two utilities set the same declaration, so
 * `twMerge` drops one and the other half of the motion silently dies.
 */
export const interactivePress = twMerge(
  "transition-[transform,color,background-color,border-color,text-decoration-color]",
  "duration-[var(--duration-quick)] ease-[var(--ease-smooth-out)]",
  "active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
);

/** Apple-style translucent surface. */
export const materialThin = "material-thin";

/** Section labels — slightly opened tracking. */
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
  "text-foreground/80 no-underline",
  "hover:bg-[color-mix(in_oklab,var(--card)_55%,transparent)] hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
);

export const socialNavRow = "flex flex-wrap items-center gap-3";

/** Inline text links (footer, prose-adjacent). */
export const textLink = twMerge(
  interactivePress,
  "inline-flex items-center rounded-sm text-muted-foreground underline decoration-zinc-400/50 underline-offset-[0.2em]",
  "hover:text-foreground hover:decoration-foreground/70",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:decoration-zinc-600 dark:hover:decoration-zinc-400"
);

/** Projects listing cards. */
export const projectCard = twMerge(
  "group relative block overflow-hidden rounded-2xl border border-border bg-card/30 p-6 text-inherit no-underline shadow-sm shadow-zinc-900/5",
  // Named properties, never `transition-all`: `all` drags unrelated style
  // changes onto the compositor for free.
  "transition-[transform,border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)]",
  "hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md hover:shadow-zinc-900/10",
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-sm",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:bg-card/20 dark:shadow-black/20 dark:hover:shadow-black/40"
);

/** Tag pills linking through to a tag page. */
export const tagChip = twMerge(
  materialThin,
  // Hover/press paint and motion live in `.tag-chip` (global.css).
  "tag-chip",
  "inline-flex min-h-8 items-center rounded-full px-3.5 py-1 font-mono text-[0.7rem] tracking-[0.02em]",
  "text-muted-foreground no-underline",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
);

/**
 * The tag you are already reading. Filled and inert — `aria-current="page"`
 * both announces it and drives the fill (see `.tag-chip[aria-current]`).
 */
export const tagChipCurrent = twMerge(tagChip, "cursor-default");

export const tagChipRow = "flex flex-wrap items-center gap-2";

export const projectStatusBadge = twMerge(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-medium uppercase tracking-wider"
);
