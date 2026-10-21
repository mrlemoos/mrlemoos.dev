import { expect, it, vi } from "vitest";
import { createProject } from "./project";
import { renderFrame } from "./render";
it("reports overlong text instead of truncating it", () => {
  const context = {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
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

it("wraps body words before overflowing and clips newspaper columns", () => {
  const context = {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
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
  const project = {
    ...createProject(),
    body: "sunlight opens windows daily",
    texture: 0,
  };
  renderFrame(canvas, project, 0);
  const bodyCalls = context.fillText.mock.calls.filter(
    ([text]) => text !== project.headline && text !== project.phrase,
  );
  const columnWidth = context.rect.mock.calls[0][2];
  expect(bodyCalls.length).toBeGreaterThan(0);
  expect(
    bodyCalls.every(([text]) => context.measureText(text).width <= columnWidth),
  ).toBe(true);
  expect(context.clip).toHaveBeenCalledTimes(4);
});

it("keeps an emptied body editable without drawing filler", () => {
  const context = {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
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
  expect(context.fillText).toHaveBeenCalledTimes(2);
});
