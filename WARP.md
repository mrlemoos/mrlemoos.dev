# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Quick Commands

### Development
- `pnpm run dev` - Start development server with Turbopack (opens on http://localhost:3000)
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

### Package Management
- `pnpm install` - Install dependencies (uses pnpm@10.11.0+)

## Environment Requirements

- **Node.js**: >=22.x (specified in package.json engines)
- **Package Manager**: pnpm (lockfile: pnpm-lock.yaml)
- **TypeScript**: v5+ with strict mode enabled

## Architecture Overview

This is a **Next.js 15** personal portfolio site using the **App Router** architecture:

### Key Technologies
- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **Content**: MDX for blog posts with gray-matter frontmatter
- **Font**: Space Mono (self-hosted in `/public/fonts/`)
- **Analytics**: Vercel Analytics
- **Theme**: Dark/light mode via next-themes

### Directory Structure
```
src/
├── app/                 # Next.js App Router
│   ├── blog/           # Blog section
│   ├── og/             # OpenGraph image generation
│   └── providers.tsx   # Theme provider wrapper
├── components/         # React components
├── lib/
│   ├── data/          # Static data (experience.ts)
│   ├── posts/         # MDX blog posts
│   └── [utils]        # Utilities (seo, fonts, css, etc.)
```

### Content Management
- **Blog Posts**: MDX files in `src/lib/posts/` with frontmatter (title, date, description, tags)
- **Experience Data**: Structured TypeScript data in `src/lib/data/experience.ts`
- **Personal Info**: Constants in `src/lib/constants.ts`

### Styling Strategy
- Tailwind CSS with custom CSS variables for theming
- Global styles in `src/app/globals.css`
- CSS-in-JS via `clsx` and `tailwind-merge` utilities
- Responsive design with mobile-first approach

### Key Patterns
- **SEO**: Centralized metadata management via `src/lib/seo.ts` with lodash.merge
- **Fonts**: Self-hosted fonts loaded via Next.js font optimization
- **Theme**: System-preference detection with manual override capability
- **Content**: File-system based routing for blog posts with dynamic generation

## Development Notes

- Uses **Turbopack** for faster development builds
- MDX support enabled in `next.config.ts` for `.md` and `.mdx` files
- ESLint configured with Next.js recommended rules
- Path aliases configured: `@/*` → `./src/*`
- OpenGraph images dynamically generated via `/og` route