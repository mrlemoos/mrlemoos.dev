import { describe, expect, it } from "vitest";
import {
  GOOGLE_ANALYTICS_MEASUREMENT_ID,
  isGoogleAnalyticsEnabled,
} from "./consent.ts";

describe("GOOGLE_ANALYTICS_MEASUREMENT_ID", () => {
  it("is the measurement ID for the live property", () => {
    expect(GOOGLE_ANALYTICS_MEASUREMENT_ID).toBe("G-2Q8LST53B5");
  });
});

describe("isGoogleAnalyticsEnabled", () => {
  it("is disabled during local development", () => {
    expect(
      isGoogleAnalyticsEnabled({ PROD: false, VERCEL_ENV: "development" })
    ).toBe(false);
  });

  it("is disabled on a Vercel preview deployment even though PROD is true", () => {
    expect(isGoogleAnalyticsEnabled({ PROD: true, VERCEL_ENV: "preview" })).toBe(
      false
    );
  });

  it("is disabled on a Vercel development deployment", () => {
    expect(
      isGoogleAnalyticsEnabled({ PROD: true, VERCEL_ENV: "development" })
    ).toBe(false);
  });

  it("fails closed when VERCEL_ENV is missing", () => {
    expect(isGoogleAnalyticsEnabled({ PROD: true })).toBe(false);
    expect(isGoogleAnalyticsEnabled({ PROD: true, VERCEL_ENV: "" })).toBe(false);
    expect(isGoogleAnalyticsEnabled({})).toBe(false);
  });

  it("fails closed for an unrecognised VERCEL_ENV value", () => {
    expect(
      isGoogleAnalyticsEnabled({ PROD: true, VERCEL_ENV: "Production" })
    ).toBe(false);
    expect(
      isGoogleAnalyticsEnabled({ PROD: true, VERCEL_ENV: "staging" })
    ).toBe(false);
  });

  it("is enabled only on the Vercel production deployment", () => {
    expect(
      isGoogleAnalyticsEnabled({ PROD: true, VERCEL_ENV: "production" })
    ).toBe(true);
  });

  it("is disabled when a production VERCEL_ENV leaks into a non-production build", () => {
    expect(
      isGoogleAnalyticsEnabled({ PROD: false, VERCEL_ENV: "production" })
    ).toBe(false);
  });
});
