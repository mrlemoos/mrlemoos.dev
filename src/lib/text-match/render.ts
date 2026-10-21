import { frameLayout, type Project } from "./project";
export function renderFrame(
  canvas: HTMLCanvasElement,
  project: Project,
  time: number,
): { fits: boolean } {
  const f = frameLayout(project, time);
  if (canvas.width !== f.width) canvas.width = f.width;
  if (canvas.height !== f.height) canvas.height = f.height;
  const c = canvas.getContext("2d");
  if (!c) throw new Error("Canvas rendering unavailable.");
  c.fillStyle = project.paperColour;
  c.fillRect(0, 0, f.width, f.height);
  c.save();
  c.fillStyle = project.textColour;
  c.filter = project.blur ? `blur(${project.blur}px)` : "none";
  const size = (project.preset === "magazine" ? 50 : 34) * project.zoom;
  c.font = `400 ${size}px "${project.fontFamily}"`;
  c.globalAlpha = project.preset === "clean" ? 0.18 : 0.65;
  const words = project.body.trim().split(/\s+/).filter(Boolean);
  let index = Math.floor(f.variation * words.length);
  const columns =
    project.preset === "newspaper" ? 3 : project.preset === "magazine" ? 2 : 1;
  const margin = f.width * (project.preset === "book" ? 0.12 : 0.04);
  const column = (f.width - margin * 2) / columns;
  const gutter = size * 0.8;
  const columnWidth = column - gutter;
  const lineHeight = size * (project.preset === "clean" ? 4 : 1.35);
  for (
    let columnIndex = 0;
    words.length > 0 && columnIndex < columns;
    columnIndex++
  ) {
    const x = margin + columnIndex * column;
    c.save();
    c.beginPath();
    c.rect(x, 0, columnWidth, f.height);
    c.clip();
    for (
      let y = -f.variation * lineHeight;
      y < f.height + size;
      y += lineHeight
    ) {
      let line = "";
      while (line.length < 250) {
        const word = words[index % words.length];
        const candidate = line ? `${line} ${word}` : word;
        if (c.measureText(candidate).width > columnWidth) {
          if (!line) {
            line = word;
            index++;
          }
          break;
        }
        line = candidate;
        index++;
      }
      c.fillText(line, x, y);
    }
    c.restore();
  }
  const headlineSize =
    size *
    (project.preset === "magazine"
      ? 2.5
      : project.preset === "book"
        ? 1.3
        : 1.8);
  const headlineY = f.focalY - 160 - f.variation * 180;
  c.save();
  c.beginPath();
  c.rect(
    margin,
    headlineY - headlineSize * 1.15,
    f.width - margin * 2,
    headlineSize * 1.5,
  );
  c.clip();
  c.globalAlpha = 1;
  c.fillStyle = project.paperColour;
  c.fillRect(
    margin,
    headlineY - headlineSize * 1.15,
    f.width - margin * 2,
    headlineSize * 1.5,
  );
  c.globalAlpha = 0.9;
  c.fillStyle = project.textColour;
  c.font = `700 ${headlineSize}px "${project.fontFamily}"`;
  c.fillText(project.headline, margin, headlineY);
  c.restore();
  c.restore();
  if (project.texture > 0) {
    c.fillStyle = project.textColour;
    c.globalAlpha = project.texture * 0.18;
    for (let i = 0; i < 2400; i++) {
      const n = Math.imul(i + 1, 16807) >>> 0;
      c.fillRect(n % f.width, (Math.imul(n, 48271) >>> 0) % f.height, 1.5, 1.5);
    }
    c.globalAlpha = 1;
  }
  let fontSize = 80 * project.zoom;
  c.font = `${project.fontWeight} ${fontSize}px "${project.fontFamily}"`;
  const available = Math.min(f.focalX, f.width - f.focalX) * 2 - 60;
  while (c.measureText(project.phrase).width > available && fontSize > 28) {
    fontSize -= 2;
    c.font = `${project.fontWeight} ${fontSize}px "${project.fontFamily}"`;
  }
  const metrics = c.measureText(project.phrase);
  const width = metrics.width;
  const left = f.focalX - width / 2,
    top = f.focalY - fontSize * 0.65;
  const baseline = top + fontSize * 0.9;
  const artworkTop = Math.min(
    top - 18,
    baseline - (metrics.actualBoundingBoxAscent ?? fontSize),
  );
  const artworkBottom = Math.max(
    top + fontSize * 1.3 + 18,
    baseline + (metrics.actualBoundingBoxDescent ?? fontSize * 0.3),
  );
  const fits =
    width <= available && artworkTop >= 0 && artworkBottom <= f.height;
  c.fillStyle = project.paperColour;
  c.fillRect(left - 22, top - 18, width + 44, fontSize * 1.3 + 36);
  c.fillStyle = project.highlightColour;
  if (project.highlight === "marker")
    c.fillRect(left - 12, top, width + 24, fontSize * 1.12);
  if (project.highlight === "underline")
    c.fillRect(left - 5, top + fontSize * 1.05, width + 10, 8);
  if (project.highlight === "box") {
    c.strokeStyle = project.highlightColour;
    c.lineWidth = 8;
    c.strokeRect(left - 14, top - 8, width + 28, fontSize * 1.3);
  }
  c.fillStyle = project.textColour;
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  c.fillText(project.phrase, f.focalX, baseline);
  c.textAlign = "start";
  return { fits };
}
export { loadProjectFonts } from "./fonts";
export { exportVideo } from "./export";
