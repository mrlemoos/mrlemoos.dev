import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** At least ~48×48px hit area for PageSpeed tap-target and accessibility audits. */
export const socialNavLink =
  "inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-md px-3 text-center underline-offset-2 hover:underline";

export const socialNavRow = "flex flex-wrap items-center gap-3";
