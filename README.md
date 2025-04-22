# mrlemoos.dev - Personal Portfolio

A modern, responsive personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. This portfolio showcases professional experience, skills, and projects in a clean, minimalist design.

## Features

- 🚀 Built with Next.js 15 and React 19
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS
- 📝 MDX support for blog posts
- 🖼️ Dynamic OpenGraph image generation
- 🔍 SEO optimized
- 🎯 TypeScript for type safety
- 🎨 Space Mono font for a unique typography style

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX
- **Font**: Space Mono
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- pnpm (package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mrlemoos/mrlemoos.dev.git && cd mrlemoos.dev
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and data
├── styles/          # Global styles
```

## Available Scripts

- `pnpm run dev` - Start development server with Turbopack
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

## Customisation

- Update personal information in `src/lib/data/`
- Modify styles in `src/styles/`
- Add new components in `src/components/`
- Create blog posts using MDX in the appropriate directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Space Mono](https://fonts.google.com/specimen/Space+Mono)
- [Vercel](https://vercel.com/)
