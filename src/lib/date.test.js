import { describe, expect, it } from "vitest";
import { formatDate } from "./date.ts";

describe("formatDate", () => {
  it("formats a date in en-GB", () => {
    expect(formatDate(new Date(2024, 2, 15))).toBe("15 March 2024");
  });
});
