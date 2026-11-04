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

it("combines photography into one revealing image stack", () => {
  const source = readFileSync(new URL("./Launch.astro", import.meta.url), "utf8");
  const stack = source.slice(source.indexOf('class="tile photo photo-stack"'), source.indexOf("</a>", source.indexOf('class="tile photo photo-stack"')));
  for (const photo of ["madrid-light.jpg", "madrid-architecture.jpg", "madrid-street.jpg"]) {
    expect(stack).toContain(photo);
  }
  expect(source.match(/href=\{instagram\}/g)).toHaveLength(1);
  expect(source).not.toContain("photo-leaves");
  expect(source).not.toContain("photo-detail");
  expect(source).toContain(".photo-stack:hover .photo-stack-front");
  expect(source).toContain(".photo-stack:focus-visible .photo-stack-front");
  expect(source).toContain(".photo-stack{overflow:visible");
  expect(source).toContain("translate(-42%,-8%) rotate(-8deg) scale(.9)");
  expect(source).toContain("translateY(-12%) scale(.92)");
  expect(source).toContain("translate(42%,-8%) rotate(8deg) scale(.9)");
  expect(source).not.toContain("width:30%;height:78%");
  expect(source).not.toContain("translateY(22%)");
});

it("gives tiles a restrained double border", () => {
  const source = readFileSync(new URL("./Launch.astro", import.meta.url), "utf8");
  expect(source).toContain("--tile-edge:#dfe3e7");
  expect(source).toContain("--tile-inner:#ffffffb8");
  expect(source).toMatch(/\.tile:before\{[^}]*inset:4px[^}]*border:1px solid var\(--tile-inner\)/);
  expect(source).toContain("border-radius:calc(var(--tile-radius) - 5px)");
  expect(source).toContain("--tile-edge:#343b43;--tile-inner:#ffffff14");
  expect(source).toContain(".photo-stack:is(:hover,:focus-visible):before{opacity:0}");
});

it("keeps the travelling rabbit beneath tile content", () => {
  const launch = readFileSync(new URL("./Launch.astro", import.meta.url), "utf8");
  const rabbit = readFileSync(new URL("./KonijnRabbit.astro", import.meta.url), "utf8");
  expect(launch).toMatch(/\.bento\{[^}]*isolation:isolate/);
  expect(launch).toContain(".bento>.tile{z-index:1}");
  expect(rabbit).toMatch(/\.rabbit \{[^}]*z-index:0/);
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

it("fills the desktop viewport with the opening bento composition", () => {
  const source = readFileSync(new URL("./Launch.astro", import.meta.url), "utf8");
  expect(source).toContain("--available-height:calc(100svh - var(--nav-height) - var(--page-gutter))");
  expect(source).toContain("--grid-width:min(var(--available-width),calc(var(--available-height) * 16 / 9))");
  expect(source).toContain("--hero-height:max(440px,min(var(--available-height),calc(var(--available-width) * 9 / 16)))");
  expect(source).toMatch(/\.bento\{[^}]*width:var\(--grid-width\)/);
  expect(source).toMatch(/\.bio,.photo-stack\{[^}]*min-height:var\(--hero-height\)/);
  expect(source).toContain("grid-template-rows:minmax(0,calc((var(--hero-height) - var(--bento-gap)) * .54)) minmax(0,calc((var(--hero-height) - var(--bento-gap)) * .46))");
  expect(source).toContain("@media(min-width:701px)");
  expect(source).toContain("@media(min-width:701px) and (max-height:700px)");
  expect(source).toContain("@media(min-width:1101px)");
  expect(source).toMatch(/\.bio h1\{[^}]*clamp\(64px,7vw,118px\)/);
  expect(source).toMatch(/\.impact\{[^}]*display:flex[^}]*flex-direction:column/);
  expect(source).toMatch(/@media\(min-width:1101px\)\{\.bio\{grid-column:1\/span 4/);
  expect(source).toContain(".madrid{grid-column:5/span 4;grid-row:2}");
  expect(source).toContain(".termi{grid-column:9/span 4;grid-row:2}");
  expect(source).toContain("@media(min-width:1400px) and (min-height:850px)");
  expect(source).toContain("* .29)) minmax(0,calc((var(--hero-height) - var(--bento-gap) * 2) * .29)) minmax(0,calc((var(--hero-height) - var(--bento-gap) * 2) * .25))");
  expect(source).toContain(".bio{grid-row:1/span 2;height:auto;min-height:0}");
  expect(source).toContain(".grabkit{grid-column:1/span 2;grid-row:3;min-height:0;padding:14px");
  expect(source).toContain(".planria{grid-column:3/span 2;grid-row:3");
  expect(source).toContain(".github{grid-column:5/span 5;grid-row:3");
  expect(source).toContain(".contact{grid-column:10/span 3;grid-row:3");
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
