import { describe, expect, it } from "vitest";
import { assertAdminDevOnly, adminNotFoundResponse } from "./dev-gate.ts";

describe("assertAdminDevOnly", () => {
  it("allows Local Admin when DEV is true", () => {
    expect(() => assertAdminDevOnly(true)).not.toThrow();
  });

  it("refuses Local Admin when DEV is false", () => {
    expect(() => assertAdminDevOnly(false)).toThrow(/not available/i);
  });
});

describe("adminNotFoundResponse", () => {
  it("returns a 404 Response for non-DEV requests", () => {
    const response = adminNotFoundResponse();
    expect(response.status).toBe(404);
  });
});
