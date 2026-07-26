import { describe, expect, it, vi } from "vitest";
import {
  assertOnMainForRemoteWrite,
  commitAndPushPostPaths,
  getCurrentBranch,
  stagePostPaths,
} from "./git.ts";

describe("assertOnMainForRemoteWrite", () => {
  it("allows Publish/Unpublish/Delete-push on main", () => {
    expect(() => assertOnMainForRemoteWrite("main")).not.toThrow();
  });

  it("refuses remote writes when not on main", () => {
    expect(() => assertOnMainForRemoteWrite("feature/admin")).toThrow(
      /only allowed on main/i
    );
  });
});

describe("stagePostPaths", () => {
  it("stages only the given Post path(s)", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "", stderr: "" });
    await stagePostPaths(run, ["src/content/blog/hello-world.mdx"]);
    expect(run).toHaveBeenCalledWith([
      "add",
      "--",
      "src/content/blog/hello-world.mdx",
    ]);
  });

  it("refuses empty path lists", async () => {
    const run = vi.fn();
    await expect(stagePostPaths(run, [])).rejects.toThrow(/at least one/i);
  });
});

describe("commitAndPushPostPaths", () => {
  it("stages, commits with the message, and pushes only after main check", async () => {
    const run = vi
      .fn()
      .mockResolvedValueOnce({ stdout: "main\n", stderr: "" }) // rev-parse --abbrev-ref HEAD
      .mockResolvedValue({ stdout: "", stderr: "" });

    await commitAndPushPostPaths(run, {
      paths: ["src/content/blog/hello-world.mdx"],
      message: 'docs(blog): add "Hello World"',
    });

    expect(run.mock.calls).toEqual([
      [["rev-parse", "--abbrev-ref", "HEAD"]],
      [["add", "--", "src/content/blog/hello-world.mdx"]],
      [["commit", "-m", 'docs(blog): add "Hello World"']],
      [["push", "origin", "main"]],
    ]);
  });

  it("does not stage, commit, or push when off main", async () => {
    const run = vi
      .fn()
      .mockResolvedValueOnce({ stdout: "feat/x\n", stderr: "" });

    await expect(
      commitAndPushPostPaths(run, {
        paths: ["src/content/blog/hello-world.mdx"],
        message: 'docs(blog): update "Hello World"',
      })
    ).rejects.toThrow(/only allowed on main/i);

    expect(run).toHaveBeenCalledTimes(1);
  });
});

describe("getCurrentBranch", () => {
  it("returns the current branch name", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "main\n", stderr: "" });
    await expect(getCurrentBranch(run)).resolves.toBe("main");
  });
});
