# mrlemoos.dev

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Hi there, 👋

This small project is built to be my portfolio with a bit of my experience and
realizations. Also, it is a repository to share my articles, projects, and
stacks and tell you how I used a few technologies.

This project is created with [React](https://react.dev),
[shadcn/ui](https://ui.shadcn.com), and [TailwindCSS](https://tailwindcss.com).

The homepage is inspired by the [Spotlight](https://spotlight.tailwind.com)
template from the TailwindLabs team, despite liking the original so much, I
wanted to change it a bit and here's the result.

If you'd like to support their amazing work, please don't hesitate to take a
look at the [TailwindUI templates](https://tailwindui.com/templates)
marketplace, which is fabulous.

## Stack

- [Next.js](https://nextjs.org) by Vercel | _The React Framework_.
- [React](https://react.dev) | _The library for web and native user interfaces_.
- [shadcn/ui](https://ui.shadcn.com) | The anti-hero of UI components libraries
    (_my words, not theirs_).
- [TailwindCSS](https://tailwindcss.com) | _Rapidly build modern websites
    without ever leaving your HTML_.
- [Contentful](https://contentful.com) | _Contentful is the platform where you
    can update the content of your website, a mobile app or any other platform
    that displays content_.

## Running the project

**Step 1.** To run this project, you must have a project created on Contentful with the
following content type(s):

- **Blog Post** (content type name: `blogPost`) with the following fields:
    `title`, `description`, `content`, `slug`, `tags`, and `createdAt`.

**Step 2**. In the `.env` file, you'll fill the `CONTENTFUL_SPACE_ID` and
`CONTENTFUL_ACCESS_TOKEN` environment variables.

> ✍️ Note: If your `CONTENTFUL_ACCESS_TOKEN` starts with the `-` (hyphen)
  character, wrap the whole token in quotes "". Otherwise, Next.js won't
  recognise it as a string.

**Step 3.** Install the dependencies and development dependencies. _I'm using
[pnpm](https://pnpm.io) here, but if you'd like to use another package manager
such as [npm](https://github.com/npm/cli) or [yarn](https://yarnpkg.com/), just
use their installation commands.

```sh
pnpm install # or pnpm i
```

**Step 4.** Start up the development server:

```sh
pnpm run dev # or pnpm dev
```

## License

This project is licensed under the Apache License, Version 2.0:

```license
Copyright 2024 Leonardo Lemos

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
