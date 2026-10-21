export type FontResource = {
  family: string;
  weight: number;
  data: string;
  licence: string;
};
export type Project = {
  version: 1;
  phrase: string;
  headline: string;
  body: string;
  preset: "newspaper" | "book" | "magazine" | "clean";
  duration: number;
  cutSpeed: number;
  seed: number;
  zoom: number;
  blur: number;
  x: number;
  y: number;
  fontFamily: string;
  fontWeight: number;
  textColour: string;
  paperColour: string;
  highlightColour: string;
  highlight: "marker" | "underline" | "box" | "none";
  texture: number;
  sound: boolean;
  format: "tiktok" | "reels" | "shorts" | "square" | "landscape";
  fonts: FontResource[];
};
export function createProject(): Project {
  return {
    version: 1,
    phrase: "make your mark",
    headline: "Small ideas, lasting impressions",
    body: "Across the city, a new chapter begins. People gather to share their stories, shaping tomorrow through everyday acts of imagination. Every detail holds a possibility. The ordinary becomes extraordinary when we pause long enough to notice.",
    preset: "newspaper",
    duration: 3,
    cutSpeed: 12,
    seed: 42,
    zoom: 1.5,
    blur: 0,
    x: 0.5,
    y: 0.5,
    fontFamily: "Georgia",
    fontWeight: 700,
    textColour: "#24211d",
    paperColour: "#eee7d7",
    highlightColour: "#f4d34f",
    highlight: "marker",
    texture: 0.2,
    sound: false,
    format: "tiktok",
    fonts: [],
  };
}
export function validateProject(value: unknown): Project {
  if (!value || typeof value !== "object") throw new Error("Invalid project.");
  const p = value as Project;
  const fail = () => {
    throw new Error("Invalid project settings or font resources.");
  };
  if (p.version !== 1) fail();
  for (const key of ["phrase", "headline", "body", "fontFamily"] as const)
    if (typeof p[key] !== "string" || p[key].length > 20000) fail();
  if (!p.phrase.trim() || !p.fontFamily.trim()) fail();
  const bounds = {
    duration: [1, 30],
    cutSpeed: [1, 30],
    seed: [0, 2147483647],
    zoom: [1, 3],
    blur: [0, 10],
    x: [0.1, 0.9],
    y: [0.1, 0.9],
    fontWeight: [100, 900],
    texture: [0, 1],
  };
  for (const [key, [min, max]] of Object.entries(bounds)) {
    const n = p[key as keyof Project];
    if (typeof n !== "number" || !Number.isFinite(n) || n < min || n > max)
      fail();
  }
  for (const key of ["textColour", "paperColour", "highlightColour"] as const)
    if (!/^#[0-9a-f]{6}$/i.test(p[key])) fail();
  if (
    !["newspaper", "book", "magazine", "clean"].includes(p.preset) ||
    !["marker", "underline", "box", "none"].includes(p.highlight) ||
    !["tiktok", "reels", "shorts", "square", "landscape"].includes(p.format) ||
    typeof p.sound !== "boolean"
  )
    fail();
  if (!Array.isArray(p.fonts) || p.fonts.length > 12) fail();
  let total = 0;
  for (const f of p.fonts) {
    if (
      !f ||
      typeof f.family !== "string" ||
      f.family.length > 200 ||
      !f.family.trim() ||
      typeof f.licence !== "string" ||
      f.licence.length > 20000 ||
      !Number.isFinite(f.weight) ||
      f.weight < 100 ||
      f.weight > 900 ||
      typeof f.data !== "string" ||
      !/^data:(?:font\/(?:ttf|otf|woff2?)|application\/(?:octet-stream|font-woff));base64,[A-Za-z0-9+/]+=*$/.test(
        f.data,
      )
    )
      fail();
    total += f.data.length;
  }
  if (total > 24000000) fail();
  return structuredClone(p);
}
export function dimensions(project: Project): [number, number] {
  return project.format === "square"
    ? [1080, 1080]
    : project.format === "landscape"
      ? [1920, 1080]
      : [1080, 1920];
}
export function frameLayout(project: Project, time: number) {
  const [width, height] = dimensions(project);
  const cut = Math.floor(
    Math.max(0, Math.min(time, project.duration - 0.00001)) * project.cutSpeed,
  );
  let n = (project.seed ^ Math.imul(cut + 1, 2654435761)) >>> 0;
  n = Math.imul(n ^ (n >>> 16), 2246822507) >>> 0;
  return {
    cut,
    width,
    height,
    focalX: width * project.x,
    focalY: height * project.y,
    variation: n / 4294967296,
  };
}
