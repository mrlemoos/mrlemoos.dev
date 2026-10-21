import type { FontResource, Project } from "./project";
const repository = "https://raw.githubusercontent.com/google/fonts/main";
export async function fetchFontCatalogue(): Promise<string[]> {
  const response = await fetch(`${repository}/tags/all/families.csv`);
  if (!response.ok)
    throw new Error(
      "Font catalogue unavailable. Retry or upload a local font.",
    );
  const rows = (await response.text()).split("\n");
  return [
    ...new Set(
      rows.flatMap((row) => {
        const m = /^(?:"((?:[^"]|"")*)"|([^,]+)),/.exec(row);
        return m ? [(m[1] ?? m[2]).replaceAll('""', '"')] : [];
      }),
    ),
  ].sort();
}
function dataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read font file."));
    reader.readAsDataURL(blob);
  });
}
export async function loadGoogleFont(
  family: string,
  weight: number,
): Promise<FontResource> {
  const directory = family.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const category of ["ofl", "apache", "ufl"]) {
    const base = `${repository}/${category}/${directory}`;
    const metadata = await fetch(`${base}/METADATA.pb`);
    if (!metadata.ok) continue;
    const source = await metadata.text();
    const blocks = [...source.matchAll(/fonts\s*\{([\s\S]*?)\}/g)].map(
      (m) => m[1],
    );
    const block =
      blocks.find(
        (b) =>
          b.includes('style: "normal"') &&
          new RegExp(`weight: ${weight}\\b`).test(b),
      ) ??
      blocks.find(
        (b) =>
          b.includes('style: "normal"') && /filename: "[^"]*\[.*wght/.test(b),
      );
    const filename = block?.match(/filename: "([^"]+)"/)?.[1];
    if (!filename)
      throw new Error(
        `Weight ${weight} unavailable for ${family}. Choose another weight or upload a font.`,
      );
    const response = await fetch(`${base}/${encodeURIComponent(filename)}`);
    if (!response.ok)
      throw new Error("Font download failed. Retry or upload a local font.");
    const licenceResponse = await fetch(
      `${base}/${category === "ofl" ? "OFL.txt" : category === "apache" ? "LICENSE.txt" : "LICENCE.txt"}`,
    );
    if (!licenceResponse.ok)
      throw new Error("Font licence unavailable; cannot package this font.");
    const blob = await response.blob();
    if (blob.size > 12000000)
      throw new Error("Font exceeds the 12 MB project limit.");
    return {
      family,
      weight,
      data: await dataURL(new Blob([blob], { type: "font/ttf" })),
      licence: await licenceResponse.text(),
    };
  }
  throw new Error("Font not found. Retry or upload a local font.");
}
const loaded = new Map<string, FontFace>();
let fontRequest = 0;
export async function loadProjectFonts(project: Project): Promise<void> {
  const request = ++fontRequest;
  const resource = project.fonts.find(
    (font) =>
      font.family === project.fontFamily && font.weight === project.fontWeight,
  );
  if (resource) {
    const key = `${resource.family}:${resource.weight}:${resource.data}`;
    if (!loaded.has(key)) {
      try {
        const face = new FontFace(resource.family, `url("${resource.data}")`, {
          weight: String(resource.weight),
        });
        await face.load();
        if (request !== fontRequest) return;
        for (const previous of loaded.values()) document.fonts.delete(previous);
        loaded.clear();
        document.fonts.add(face);
        loaded.set(key, face);
      } catch {
        if (request !== fontRequest) return;
        throw new Error(
          `Could not load ${resource.family}. Upload a valid font before exporting.`,
        );
      }
    }
  } else if (
    ![
      "Georgia",
      "Arial",
      "Times New Roman",
      "Verdana",
      "Helvetica",
      "serif",
      "sans-serif",
    ].includes(project.fontFamily)
  ) {
    throw new Error(
      "Selected font weight unavailable. Load the font again before exporting.",
    );
  }
  await document.fonts.ready;
}
