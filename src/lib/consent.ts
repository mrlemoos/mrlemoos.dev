/** localStorage key for cookie / ad consent choice. */
export const CONSENT_STORAGE_KEY = "mrlemoos-cookie-consent" as const;

export type ConsentValue = "granted" | "denied";

export const GOOGLE_ADS_CLIENT = "ca-pub-7238420365748340" as const;

export const GOOGLE_PARTNERS_URL =
  "https://www.google.com/policies/privacy/partners/" as const;

/** Milliseconds Google tags wait for a consent update before firing. */
export const GOOGLE_CONSENT_WAIT_FOR_UPDATE_MS = 500 as const;

/** GA4 measurement ID for the live mrlemoos.dev property. */
export const GOOGLE_ANALYTICS_MEASUREMENT_ID = "G-2Q8LST53B5" as const;

/** The only `VERCEL_ENV` value that represents the live deployment. */
const VERCEL_PRODUCTION_ENV = "production" as const;

/**
 * Subset of `import.meta.env` needed to decide whether Google Analytics runs.
 */
export interface GoogleAnalyticsEnv {
  /** Vite/Astro production build flag — also true for Vercel preview builds. */
  readonly PROD?: boolean;
  /** Vercel deployment environment: `production` | `preview` | `development`. */
  readonly VERCEL_ENV?: string;
}

/**
 * Google Analytics must only run on the live production deployment.
 *
 * `PROD` alone is not enough: Vercel preview builds are production Vite builds,
 * so `import.meta.env.PROD` is `true` for them too and preview traffic would
 * pollute the GA property. `VERCEL_ENV` is the only signal that separates the
 * live deployment from previews, so both are required.
 *
 * Deliberately fails closed: anything other than an exact `"production"` match
 * (including a missing value, e.g. a local `astro build`) disables analytics.
 */
export function isGoogleAnalyticsEnabled(env: GoogleAnalyticsEnv): boolean {
  return env.PROD === true && env.VERCEL_ENV === VERCEL_PRODUCTION_ENV;
}
