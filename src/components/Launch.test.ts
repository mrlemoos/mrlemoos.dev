// @vitest-environment node
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import GitHubActivity from "./GitHubActivity.astro";
import { renderAstroComponent } from "@/test-utils/render-astro.js";
import activity from "@/lib/data/github-contributions.json";

it("gives visitors work, hiring and real photography paths", () => {
  const source = readFileSync(new URL("./Launch.astro", import.meta.url), "utf8");
  for (const destination of ["#work", "#contact", "https://www.instagram.com/don.leo.lemos/", "EMAIL_URL", "LINKEDIN_URL"]) {
    expect(source).toContain(destination);
  }
  for (const photo of ["madrid-architecture", "madrid-street", "madrid-light"]) {
    expect(readFileSync(new URL(`../../public/images/photography/${photo}.jpg`, import.meta.url)).length).toBeGreaterThan(1000);
  }
});

it("renders accessible daily counts and styles refreshed client-side squares", async () => {
  const html = await renderAstroComponent(GitHubActivity);
  expect(html.match(/data-label=/g)).toHaveLength(activity.days.length);
  expect(html).toContain('aria-label="Daily GitHub contributions"');
  expect(html).toContain('data-activity-tooltip');
  const source = readFileSync(new URL("./GitHubActivity.astro", import.meta.url), "utf8");
  expect(source).toContain(":global(.day)");
});

it("puts GitHub in navigation and explains the performance result", () => {
  const source = readFileSync(new URL("./Launch.astro", import.meta.url), "utf8");
  const header = source.slice(source.indexOf('<header'), source.indexOf('</header>'));
  expect(header).toContain('href={GITHUB_URL}');
  expect(source).toContain('AB InBev · Web performance');
  expect(source).toContain('Cut time to first visible content');
});
