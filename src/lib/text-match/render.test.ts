import { expect, it, vi } from "vitest";
import { createProject } from "./project";
import { renderFrame } from "./render";
it("prints context on the same line as the focal phrase", () => {
  const context = {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    measureText: (text: string) => ({ width: text.length * 20 }),
  };
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
  } as unknown as HTMLCanvasElement;
  const project = { ...createProject(), texture: 0 };
  renderFrame(canvas, project, 0);
  const focal = context.fillText.mock.calls.find(
    ([text]) => text === project.phrase,
  )!;
  expect(
    context.fillText.mock.calls.filter(
      ([text, , y]) => text !== project.phrase && y === focal[2],
    ),
  ).toHaveLength(2);
});
it("reports overlong text instead of truncating it", () => {
  const context = {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    beginPath: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    restore: vi.fn(),
    measureText: (text: string) => ({ width: text.length * 20 }),
  };
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
  } as unknown as HTMLCanvasElement;
  const project = {
    ...createProject(),
    texture: 0,
    phrase: "long ".repeat(100),
  };
  expect(renderFrame(canvas, project, 0).fits).toBe(false);
  expect(context.fillText).toHaveBeenLastCalledWith(
    project.phrase,
    540,
    expect.any(Number),
  );
});

it("warns when vertical framing crops focal artwork despite fitting width", () => {
  const context = {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    beginPath: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    restore: vi.fn(),
    measureText: (text: string) => ({ width: text.length * 20 }),
  };
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
  } as unknown as HTMLCanvasElement;
  const project = {
    ...createProject(),
    phrase: "Hi",
    format: "landscape" as const,
    zoom: 3,
    y: 0.1,
    texture: 0,
  };
  expect(renderFrame(canvas, project, 0).fits).toBe(false);
  expect(renderFrame(canvas, { ...project, y: 0.5 }, 0).fits).toBe(true);
});

it("keeps an emptied body editable without drawing filler", () => {
  const context = {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    measureText: (text: string) => ({ width: text.length * 20 }),
  };
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
  } as unknown as HTMLCanvasElement;
  const project = { ...createProject(), body: "   ", texture: 0 };
  expect(renderFrame(canvas, project, 0).fits).toBe(true);
  expect(context.fillText.mock.calls.map(([text]) => text)).toEqual([
    project.headline,
    project.phrase,
  ]);
});

it("keeps text crops repeatable while changing context between cuts", () => {
  const context = {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    restore: vi.fn(),
    measureText: (text: string) => ({
      width: text.length * 20,
      actualBoundingBoxAscent: 80,
      actualBoundingBoxDescent: 20,
    }),
  };
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
  } as unknown as HTMLCanvasElement;
  const project = { ...createProject(), texture: 0 };
  renderFrame(canvas, project, 0);
  const first = structuredClone(context.fillText.mock.calls);
  context.fillText.mockClear();
  renderFrame(canvas, project, 0);
  expect(context.fillText.mock.calls).toEqual(first);
  context.fillText.mockClear();
  renderFrame(canvas, project, 1);
  expect(context.fillText.mock.calls).not.toEqual(first);
  expect(
    context.fillText.mock.calls.find(([text]) => text === project.phrase),
  ).toEqual([project.phrase, 540, 990]);
  expect(first.find(([text]) => text === project.phrase)).toEqual([
    project.phrase,
    540,
    990,
  ]);
  expect(first.some(([text]) => text === "THE DAILY EDITION")).toBe(false);
});
