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

it("groups Galicia, Konijn, and Ludus as projects", () => {
  const source = readFileSync(new URL("./Launch.astro", import.meta.url), "utf8");
  expect(source).toContain("projects-tile");
  expect(source).toContain('aria-label="Selected work"');
  expect(source).not.toContain('id="projects-title">Projects</h2>');
  expect(source).toContain('class="projects-subtiles"');
  expect(source).not.toContain("ProjectFrame");
  expect(source).toContain('class="project-rim"');
  expect(source).toContain('class="project-face"');
  expect(source).toContain("--rim-highlight");
  expect(source).toMatch(/\.projects-subtiles \.project-rim\{[^}]*width:100%/);
  expect(source).toMatch(/\.projects-subtiles \.project-rim\{[^}]*padding:0/);
  expect(source).toContain(".project-card:before");
  expect(source).toContain(".project-card:after");
  expect(source).not.toContain(".project-rim:before");
  expect(source).not.toContain(".project-rim:after");
  expect(source).toContain(".project-face:before");
  expect(source).toContain(".project-face:after");
  expect(source).toContain("height:calc(100% + var(--depth))");
  expect(source).toContain("box-shadow:1px 0 0 var(--rim-shadow)");
  expect(source).toContain("height:calc(var(--depth) + 1px)");
  expect(source).toContain("100% 100%,var(--inset-depth) 100%");
  expect(source).toContain("100% 100%,0 100%");
  expect(source).toContain("--top:#9baabd;--left:#6f8195");
  expect(source).toContain("--top:#918bbd;--left:#69638f");
  expect(source).toContain(".project-card:hover{transform:none}");
  expect(source).toContain("color-mix(in srgb,var(--side)");
  for (const project of ["https://konijn.co", "https://galicia.mrlemoos.dev", "https://ludus.mrlemoos.dev"]) {
    expect(source).toContain(project);
  }
});

it("keeps project tiles legible in dark mode and gives Ludus a chessboard", () => {
  const source = readFileSync(new URL("./Launch.astro", import.meta.url), "utf8");
  const board = readFileSync(new URL("./LudusBoard.tsx", import.meta.url), "utf8");
  expect(source).toContain('prefers-color-scheme:dark');
  expect(source).toContain("LudusBoard");
  expect(source).toContain("client:visible");
  expect(board).toContain("WebGLRenderer");
  expect(board).toContain("LatheGeometry");
  expect(board).toContain("BaroqueQueen");
  expect(board).toContain('matchMedia("(prefers-color-scheme: dark)")');
  expect(board).toContain("group.scale.set(0.72, 1, 0.72)");
  expect(board).toContain("renderer.setSize(element.clientWidth, element.clientHeight, false)");
});
