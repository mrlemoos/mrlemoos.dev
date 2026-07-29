/** Shared remark-math options for MDX (see astro.config.mjs). */
export const remarkMathOptions = {
  /** Avoid treating `$200` / paired `$…$` in prose as inline KaTeX (currency, etc.). */
  singleDollarTextMath: false,
} as const;
