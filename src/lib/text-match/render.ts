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

  c.save();
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  c.fillStyle = project.paperColour;
  c.fillRect(0, 0, f.width, f.height);
  const italic = project.preset === "book" && f.cut % 3 === 1 ? "italic " : "";
  const font = (weight: number, size: number) =>
    `${italic}${weight} ${size}px "${project.fontFamily}"`;
  const sourceSize = 72 * project.zoom * (0.9 + f.variation * 0.2);
  let size = sourceSize;
  const available = Math.min(f.focalX, f.width - f.focalX) * 2 - f.width * 0.1;
  c.font = font(project.fontWeight, size);
  const initialWidth = c.measureText(project.phrase).width;
  const targetWidth = Math.min(available, f.width * 0.74);
  if (initialWidth > targetWidth)
    size = Math.max(28, (size * targetWidth) / initialWidth);
  c.font = font(project.fontWeight, size);
  const metrics = c.measureText(project.phrase);
  const ascent = metrics.actualBoundingBoxAscent ?? size * 0.75;
  const descent = metrics.actualBoundingBoxDescent ?? size * 0.22;
  const baseline = f.focalY + (ascent - descent) / 2;
  const left = f.focalX - metrics.width / 2;
  const top = baseline - ascent;
  const padding = size * 0.09;
  const angle = project.preset === "clean" ? 0 : (f.variation - 0.5) * 0.016;
  const halfHeight =
    ((ascent + descent) / 2) * Math.cos(angle) +
    (metrics.width / 2) * Math.abs(Math.sin(angle));
  const fits =
    metrics.width <= available + 0.01 &&
    f.focalY - halfHeight - padding >= 0 &&
    f.focalY + halfHeight + padding <= f.height;
  c.translate(f.focalX, f.focalY);
  c.rotate(angle);
  c.translate(-f.focalX, -f.focalY);

  const words = project.body.trim().split(/\s+/).filter(Boolean);
  let wordIndex = Math.floor(f.variation * words.length);
  const lineHeight =
    sourceSize *
    (project.preset === "book"
      ? 1.65
      : project.preset === "clean"
        ? 2.1
        : 1.42);
  const columnWidth = f.width * (1.3 + f.variation * 0.5);
  const columnLeft = f.focalX - columnWidth * (0.35 + f.variation * 0.3);
  const firstRow = Math.floor(-baseline / lineHeight);
  const lastRow = Math.ceil((f.height - baseline) / lineHeight);
  c.fillStyle = project.textColour;
  c.globalAlpha = project.preset === "clean" ? 0.14 : 0.78;
  c.filter = project.blur ? `blur(${project.blur}px)` : "none";
  const printFamily =
    project.preset === "magazine" || project.preset === "clean"
      ? "Arial"
      : f.cut % 3 === 1
        ? "Times New Roman"
        : "Georgia";
  c.font = `${italic}400 ${sourceSize}px "${printFamily}"`;

  for (let row = firstRow; words.length && row <= lastRow; row++) {
    if (row === 0) continue;
    let line = "";
    while (line.length < 500) {
      const word = words[wordIndex % words.length];
      const candidate = line ? `${line} ${word}` : word;
      if (c.measureText(candidate).width > columnWidth && line) break;
      line = candidate;
      wordIndex++;
      if (c.measureText(line).width >= columnWidth) break;
    }
    c.fillText(line, columnLeft, baseline + row * lineHeight);
  }

  if (words.length) {
    const context = Array.from(
      { length: 18 },
      (_, i) => words[(wordIndex + i) % words.length],
    );
    const prefix = context.slice(0, 8).join(" ");
    const suffix = context.slice(8).join(" ");
    const gap = padding + c.measureText(" ").width;
    c.fillText(prefix, left - gap - c.measureText(prefix).width, baseline);
    c.fillText(suffix, left + metrics.width + gap, baseline);
  }

  if (
    project.headline.trim() &&
    project.preset !== "clean" &&
    f.cut % 5 === 0
  ) {
    const headingY = baseline - lineHeight * (3 + (f.cut % 2));
    const headingSize = size * (project.preset === "magazine" ? 1.7 : 1.25);
    c.fillStyle = project.paperColour;
    c.globalAlpha = 1;
    c.fillRect(0, headingY - headingSize, f.width, headingSize + size * 0.25);
    c.fillStyle = project.textColour;
    c.font = font(700, headingSize);
    c.fillText(project.headline, columnLeft, headingY);
  }

  c.filter = "none";
  c.globalAlpha = 1;
  c.fillStyle = project.highlightColour;
  if (project.highlight === "marker") {
    c.fillRect(
      left - padding,
      top - padding * 0.4,
      metrics.width + padding * 2,
      ascent + descent + padding * 0.8,
    );
  } else if (project.highlight === "underline") {
    c.fillRect(
      left,
      baseline + descent + padding * 0.4,
      metrics.width,
      Math.max(4, size * 0.035),
    );
  } else if (project.highlight === "box") {
    c.strokeStyle = project.highlightColour;
    c.lineWidth = Math.max(3, size * 0.025);
    c.strokeRect(
      left - padding,
      top - padding,
      metrics.width + padding * 2,
      ascent + descent + padding * 2,
    );
  }
  c.font = font(project.fontWeight, size);
  c.fillStyle = project.textColour;
  c.textAlign = "center";
  c.fillText(project.phrase, f.focalX, baseline);

  if (project.texture > 0) {
    c.fillStyle = project.textColour;
    c.globalAlpha = project.texture * 0.16;
    let noise = (project.seed + f.cut * 1031) >>> 0;
    for (let i = 0; i < 5000; i++) {
      noise = Math.imul(noise ^ (noise >>> 15), 2246822507) >>> 0;
      const x = noise % f.width;
      noise = (Math.imul(noise, 1664525) + 1013904223) >>> 0;
      c.fillRect(x, noise % f.height, i % 7 === 0 ? 6 : 1.5, 0.7);
    }
  }
  c.restore();
  return { fits };
}

export { loadProjectFonts } from "./fonts";
export { exportVideo } from "./export";
