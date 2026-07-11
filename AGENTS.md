## Learned User Preferences

- Use conventional commit messages when committing/pushing this repo (e.g. `feat:`, `fix:`, `chore:`).
- British spelling in user-facing prose and docs.
- Write a red/green TDD strategy when implementing or explaining changes.
- Only create git commits or push when explicitly requested.

## Learned Workspace Facts

- Site built with Astro 6 (migrated from Next.js): blog posts under `src/content/blog` via Astro content collections; MDX uses remark-math + rehype-katex for maths; Tailwind CSS v4 wired through Vite; deploy via `@astrojs/vercel` with prerendered pages + dynamic Open Graph image route; package manager pnpm; target Node 24.x.
- Typography/theme: Geist for body/UI sans, serif (e.g. Instrument Serif) for headings, grey-first palette, deliberate micro-interactions for polished portfolio feel.
- Agent config consolidated under `.agents/` with `.cursor` and `.claude` symlinks; `CLAUDE.md` symlinks `AGENTS.md`.
- Vitest unit tests: colocated `src/**/*.test.js` importing TS/TSX/Astro via Astro `getViteConfig()` in `vitest.config.ts`; `pnpm test` / `pnpm test:run`; jsdom for React tests, node for Astro Container tests.
- GitHub Actions CI (`.github/workflows/ci.yml`): `pnpm lint` → `check` → `test:run` → `build` on Node 24; checkout, setup-node, and pnpm/action-setup v6.
- Homepage featured writing merges local blog posts with `src/lib/data/external-writing.ts`; projects page at `/projects` from `src/lib/data/projects.ts`.
- Google AdSense: consent banner and Consent Mode v2 before loading scripts; in-article ad on blog posts; `public/ads.txt`; privacy policy at `/privacy`.
- Production-only behaviour uses `import.meta.env.PROD`, not `process.env.NODE_ENV`.
