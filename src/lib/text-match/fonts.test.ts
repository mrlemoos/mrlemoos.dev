import { createProject } from "./project";
import { afterEach, expect, it, vi } from "vitest";
import { fetchFontCatalogue, loadGoogleFont, loadProjectFonts } from "./fonts";
afterEach(() => vi.unstubAllGlobals());
it("search catalogue uses metadata only and deduplicates families", async () => {
  const fetch = vi.fn(
    async () =>
      new Response(
        "ABeeZee,,/Expressive/Active,10\nABeeZee,,/Expressive/Calm,81\nRoboto,,/Sans,5\n",
      ),
  );
  vi.stubGlobal("fetch", fetch);
  expect(await fetchFontCatalogue()).toEqual(["ABeeZee", "Roboto"]);
  expect(fetch).toHaveBeenCalledOnce();
  expect(fetch.mock.calls[0]).toEqual([
    "https://raw.githubusercontent.com/google/fonts/main/tags/all/families.csv",
  ]);
});
it("rejects unavailable static weights before downloading a misleading font", async () => {
  const fetch = vi.fn(
    async () =>
      new Response(
        'fonts {\n style: "normal"\n weight: 400\n filename: "Font-Regular.ttf"\n}',
      ),
  );
  vi.stubGlobal("fetch", fetch);
  await expect(loadGoogleFont("Example", 900)).rejects.toThrow(
    "Weight 900 unavailable",
  );
  expect(fetch).toHaveBeenCalledOnce();
});

it("loads only selected embedded face and removes previous face", async () => {
  const add = vi.fn(),
    remove = vi.fn();
  vi.stubGlobal("document", {
    fonts: { add, delete: remove, ready: Promise.resolve() },
  });
  const load = vi.fn(async function (this: unknown) {
    return this;
  });
  vi.stubGlobal(
    "FontFace",
    class {
      load = load;
    },
  );
  const one = {
    family: "One",
    weight: 400,
    data: "data:font/ttf;base64,YQ==",
    licence: "test",
  };
  const two = { ...one, family: "Two" };
  await loadProjectFonts({
    ...createProject(),
    fontFamily: "One",
    fontWeight: 400,
    fonts: [one, two],
  });
  expect(load).toHaveBeenCalledOnce();
  await loadProjectFonts({
    ...createProject(),
    fontFamily: "Two",
    fontWeight: 400,
    fonts: [one, two],
  });
  expect(load).toHaveBeenCalledTimes(2);
  expect(remove).toHaveBeenCalledOnce();
});

it("ignores stale font completion before registry changes", async () => {
  const add = vi.fn(),
    remove = vi.fn();
  vi.stubGlobal("document", {
    fonts: { add, delete: remove, ready: Promise.resolve() },
  });
  const pending = new Map<string, () => void>();
  vi.stubGlobal(
    "FontFace",
    class {
      constructor(public family: string) {}
      load() {
        return new Promise((resolve) =>
          pending.set(this.family, () => resolve(this)),
        );
      }
    },
  );
  const project = (family: string) => ({
    ...createProject(),
    fontFamily: family,
    fontWeight: 400,
    fonts: [
      {
        family,
        weight: 400,
        data: "data:font/ttf;base64,YQ==",
        licence: "test",
      },
    ],
  });
  const slow = loadProjectFonts(project("Slow"));
  const fast = loadProjectFonts(project("Fast"));
  pending.get("Fast")!();
  await fast;
  const deletions = remove.mock.calls.length;
  pending.get("Slow")!();
  await slow;
  expect(add).toHaveBeenCalledOnce();
  expect(add.mock.calls[0][0].family).toBe("Fast");
  expect(remove).toHaveBeenCalledTimes(deletions);
});
