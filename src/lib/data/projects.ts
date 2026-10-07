export type ProjectStatus = "live" | "beta" | "building";

export interface Project {
  name: string;
  url: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
}

export const projects: Project[] = [
  {
    name: "plan/ria",
    url: "https://planria.co.uk",
    description:
      "Shared money for UK couples — Open Banking splits, flexible rules, and a financial compatibility snapshot before launch.",
    status: "building",
    tags: ["FinTech", "Open Banking", "UK"],
  },
  {
    name: "Grabkit",
    url: "https://grabkit.dev",
    description:
      "TypeScript HTTP client with tuple results, JSON:API by default, and explicit METHOD /path endpoints.",
    status: "live",
    tags: ["TypeScript", "Open source", "HTTP"],
  },
  {
    name: "Madrid",
    url: "https://getmadrid.app",
    description:
      "Native Mac notes for writing and linking ideas. Local-first editing, a note graph, and cloud sync.",
    status: "live",
    tags: ["macOS", "Notes", "Local-first"],
  },
  {
    name: "Termi",
    url: "https://mrlemoos.dev/termi",
    description:
      "An aesthetic, chromeless macOS terminal for coding agents — every agent gets a mascot, and tabs turn colour when Claude or Codex needs you.",
    status: "live",
    tags: ["macOS", "Rust", "Open source"],
  },
];

export const projectStatusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  beta: "Beta",
  building: "In progress",
};
