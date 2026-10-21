import { describe, expect, it } from "vitest";
import { createProject, validateProject, frameLayout } from "./project";
describe("Text Match projects", () => {
  it("round trips long phrases and rejects invalid imports", () => {
    const project = {
      ...createProject(),
      phrase: "A phrase much longer than twenty-three characters",
    };
    expect(validateProject(JSON.parse(JSON.stringify(project)))).toEqual(
      project,
    );
    for (const change of [
      { version: 2 },
      { duration: Infinity },
      { x: -1 },
      {
        fonts: [
          {
            family: "X",
            weight: 400,
            data: "https://evil.test/font",
            licence: "",
          },
        ],
      },
    ]) {
      expect(() => validateProject({ ...project, ...change })).toThrow();
    }
  });
  it("keeps focal alignment while deterministic cuts change layout", () => {
    const p = createProject();
    expect(frameLayout(p, 0.1)).toEqual(frameLayout(p, 0.1));
    expect(frameLayout(p, 0.1).focalX).toBe(frameLayout(p, 1).focalX);
    expect(frameLayout(p, 0.1).focalY).toBe(frameLayout(p, 1).focalY);
    expect(frameLayout(p, 0.1).variation).not.toBe(frameLayout(p, 1).variation);
  });
});
it("preserves blank surrounding print while requiring focal text and font", () => {
  const project = {
    ...createProject(),
    preset: "clean" as const,
    headline: "",
    body: "",
  };
  expect(validateProject(JSON.parse(JSON.stringify(project)))).toEqual(project);
  expect(() => validateProject({ ...project, phrase: "   " })).toThrow();
  expect(() => validateProject({ ...project, fontFamily: "" })).toThrow();
});
