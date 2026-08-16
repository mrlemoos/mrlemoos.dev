// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderAstroComponent } from "@/test-utils/render-astro.js";
import GoogleAnalytics from "./GoogleAnalytics.astro";

const MEASUREMENT_ID = "G-2Q8LST53B5";
const GTAG_HOST = "googletagmanager.com";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GoogleAnalytics", () => {
  it("renders nothing during local development", async () => {
    vi.stubEnv("PROD", false);
    vi.stubEnv("VERCEL_ENV", "development");

    const html = await renderAstroComponent(GoogleAnalytics);

    expect(html).not.toContain(MEASUREMENT_ID);
    expect(html).not.toContain(GTAG_HOST);
  });

  it("renders nothing on a Vercel preview deployment", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VERCEL_ENV", "preview");

    const html = await renderAstroComponent(GoogleAnalytics);

    expect(html).not.toContain(MEASUREMENT_ID);
    expect(html).not.toContain(GTAG_HOST);
  });

  it("renders nothing when VERCEL_ENV is absent", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VERCEL_ENV", undefined);

    const html = await renderAstroComponent(GoogleAnalytics);

    expect(html).not.toContain(MEASUREMENT_ID);
    expect(html).not.toContain(GTAG_HOST);
  });

  it("renders the Google tag bootstrap on the Vercel production deployment", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VERCEL_ENV", "production");

    const html = await renderAstroComponent(GoogleAnalytics);

    expect(html).toContain(MEASUREMENT_ID);
    expect(html).toContain(`https://www.${GTAG_HOST}/gtag/js`);
  });

  it("defers loading gtag.js until consent, rather than emitting an eager script tag", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VERCEL_ENV", "production");

    const html = await renderAstroComponent(GoogleAnalytics);

    expect(html).not.toMatch(/<script[^>]+src=["']https:\/\/www\.googletagmanager\.com/);
    expect(html).toContain("cookie-consent-change");
    expect(html).toContain("mrlemoos-cookie-consent");
  });

  it("grants analytics_storage through Consent Mode rather than bootstrapping its own dataLayer", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VERCEL_ENV", "production");

    const html = await renderAstroComponent(GoogleAnalytics);

    expect(html).toContain("analytics_storage");
    expect(html).toContain('"consent", "update"');
    expect(html).not.toContain("consent\", \"default\"");
    expect(html).not.toContain("window.dataLayer = window.dataLayer");
  });
});
