export interface ExternalWriting {
  id: string;
  title: string;
  description: string;
  url: string;
  date: Date;
  publisher: string;
  tags?: string[];
}

export const externalWriting: ExternalWriting[] = [
  {
    id: "agentic-coding",
    title:
      "Enterprise-Level Agentic Coding: Beyond the Hype of ‘Vibe Coding’",
    description:
      "Moving from simple prompting to disciplined workflows guided by explicit rules and architectural boundaries in large monorepos.",
    url: "https://www.credo.ai/blog/enterprise-level-agentic-coding-beyond-the-hype-of-vibe-coding",
    date: new Date("2026-04-24"),
    publisher: "Credo AI",
    tags: ["Agentic AI"],
  },
  {
    id: "gaia-design-handoff-part-2",
    title:
      "How GAIA Broke our Design-Enginering Handoff (and What We Built Instead) - Part 2",
    description:
      "Make Storybook the single source of truth for the design system — component stories as acceptance criteria to align design and engineering.",
    url: "https://www.credo.ai/blog/how-gaia-broke-our-design-enginering-handoff-and-what-we-built-instead---part-2",
    date: new Date("2026-05-18"),
    publisher: "Credo AI",
    tags: ["Agentic AI", "Design systems"],
  },
  {
    id: "skyrocketing-cost-of-tokens",
    title: "The Skyrocketing Cost of Tokens - Part 3",
    description:
      "Rationing is a finance lever. Context discipline is an engineering one.",
    url: "https://www.credo.ai/blog/the-skyrocketing-cost-of-tokens",
    date: new Date("2026-06-23"),
    publisher: "Credo AI",
    tags: ["Agentic AI"],
  },
];
