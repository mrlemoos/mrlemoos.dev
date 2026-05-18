/** localStorage key for cookie / ad consent choice. */
export const CONSENT_STORAGE_KEY = "mrlemoos-cookie-consent" as const;

export type ConsentValue = "granted" | "denied";

export const GOOGLE_ADS_CLIENT = "ca-pub-7238420365748340" as const;

export const GOOGLE_PARTNERS_URL =
  "https://www.google.com/policies/privacy/partners/" as const;

/** Milliseconds Google tags wait for a consent update before firing. */
export const GOOGLE_CONSENT_WAIT_FOR_UPDATE_MS = 500 as const;
