import { describe, expect, it } from "vitest";
import { groupByYear, bookFor } from "./book-stack";

const post = (id, date) => ({ id, date: new Date(date) });

describe("bookFor", () => {
  it("gives the same slug the same book every build", () => {
    expect(bookFor("my-tailwind-tale")).toEqual(bookFor("my-tailwind-tale"));
  });

  it("keeps every dimension inside its range", () => {
    for (const slug of ["a", "ai-design-system", "vercel-analytics", "x".repeat(80)]) {
      const { length, thickness, offset, tilt, tone } = bookFor(slug);
      expect(length).toBeGreaterThanOrEqual(72);
      expect(length).toBeLessThanOrEqual(100);
      expect(thickness).toBeGreaterThanOrEqual(0);
      expect(thickness).toBeLessThan(3);
      expect(offset).toBeGreaterThanOrEqual(0);
      expect(offset).toBeLessThanOrEqual(100);
      expect(tilt).toBeGreaterThanOrEqual(-4);
      expect(tilt).toBeLessThanOrEqual(4);
      expect(tone).toBeGreaterThanOrEqual(0);
      expect(tone).toBeLessThan(4);
    }
  });

  it("varies across slugs, or it isn't a pile", () => {
    const books = ["a", "b", "c", "d", "e", "f"].map((s) => JSON.stringify(bookFor(s)));
    expect(new Set(books).size).toBeGreaterThan(1);
  });
});

describe("groupByYear", () => {
  it("groups posts by year, newest year and post first", () => {
    const groups = groupByYear([
      post("old", "2025-04-22"),
      post("new", "2026-08-27"),
      post("mid", "2026-04-03"),
    ]);

    expect(groups.map((g) => g.year)).toEqual([2026, 2025]);
    expect(groups[0].posts.map((p) => p.id)).toEqual(["new", "mid"]);
    expect(groups[1].posts.map((p) => p.id)).toEqual(["old"]);
  });

  it("returns no groups for no posts", () => {
    expect(groupByYear([])).toEqual([]);
  });
});
