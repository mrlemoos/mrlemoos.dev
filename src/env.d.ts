/* eslint-disable @typescript-eslint/triple-slash-reference -- Astro env triple-slash */
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  __openCookieSettings?: () => void;
  adsbygoogle?: unknown[];
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
