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
    name: "Nota",
    url: "https://nota.mrlemoos.dev",
    description:
      "A quiet native Mac notes app for writing and linking ideas — no feed, no nudges, just thinking.",
    status: "live",
    tags: ["macOS", "Swift", "Notes"],
  },
];

export const projectStatusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  beta: "Beta",
  building: "In progress",
};
