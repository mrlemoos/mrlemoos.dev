import { afterEach, expect, it, vi } from "vitest";
import { createProject } from "./project";
import { exportVideo } from "./export";
vi.mock("./fonts", () => ({ loadProjectFonts: vi.fn(async () => {}) }));
vi.mock("./render", () => ({ renderFrame: vi.fn(() => ({ fits: true })) }));
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
function browser(
  payload = new Uint8Array([0, 0, 0, 12, 102, 116, 121, 112, 0, 0, 0, 0]),
) {
  const stop = vi.fn();
  const canvas = {
    width: 0,
    height: 0,
    captureStream: () => ({ getTracks: () => [{ stop }] }),
  };
  const listeners = new Map<string, EventListener>();
  const document = {
    createElement: () => canvas,
    hidden: false,
    addEventListener: (name: string, fn: EventListener) =>
      listeners.set(name, fn),
    removeEventListener: (name: string) => listeners.delete(name),
  };
  class Recorder {
    static isTypeSupported = () => true;
    state = "inactive";
    mimeType = "video/mp4";
    onstop?: () => void;
    ondataavailable?: (event: { data: Blob }) => void;
    start() {
      this.state = "recording";
    }
    stop() {
      this.state = "inactive";
      this.ondataavailable?.({ data: new Blob([payload]) });
      this.onstop?.();
    }
  }
  vi.stubGlobal("document", document);
  vi.stubGlobal("MediaRecorder", Recorder);
  return { stop, canvas, listeners, document };
}
it("exports actual detected MIME and releases capture resources", async () => {
  vi.useFakeTimers();
  const { stop, canvas, listeners } = browser();
  const pending = exportVideo({ ...createProject(), duration: 1 }, vi.fn());
  await vi.advanceTimersByTimeAsync(1100);
  expect((await pending).type).toBe("video/mp4");
  expect(stop).toHaveBeenCalledOnce();
  expect(canvas.width).toBe(0);
  expect(listeners.size).toBe(0);
});
it("cancels with cleanup when tab becomes hidden", async () => {
  const { stop, listeners, document } = browser();
  const pending = exportVideo(createProject(), vi.fn());
  const rejected = expect(pending).rejects.toThrow("Keep this tab visible");
  await Promise.resolve();
  document.hidden = true;
  listeners.get("visibilitychange")?.(new Event("visibilitychange"));
  await rejected;
  expect(stop).toHaveBeenCalledOnce();
  expect(listeners.size).toBe(0);
});

it("rejects empty encoder output and still releases capture", async () => {
  vi.useFakeTimers();
  const { stop } = browser(new Uint8Array());
  const pending = exportVideo({ ...createProject(), duration: 1 }, vi.fn());
  const rejected = expect(pending).rejects.toThrow("empty video");
  await vi.advanceTimersByTimeAsync(1100);
  await rejected;
  expect(stop).toHaveBeenCalledOnce();
});
it("cancels active recording through AbortSignal", async () => {
  const { stop, listeners } = browser();
  const controller = new AbortController();
  const pending = exportVideo(createProject(), vi.fn(), controller.signal);
  const rejected = expect(pending).rejects.toThrow("Export cancelled");
  await Promise.resolve();
  controller.abort();
  await rejected;
  expect(stop).toHaveBeenCalledOnce();
  expect(listeners.size).toBe(0);
});
