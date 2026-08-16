/** Route prefixes that exist only in DEV and 404 in production. */
const PRIVATE_PREFIXES = ["/admin"];

/**
 * Sitemap filter. `@astrojs/sitemap` enumerates routes from the build, so it
 * lists the Local Admin even though those pages are DEV-only and already carry
 * `noindex` — advertising URLs that 404 for every crawler that follows them.
 */
export function isPublicSitemapPage(page: string): boolean {
  const { pathname } = new URL(page);

  return !PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
