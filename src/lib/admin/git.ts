export type GitRunner = (
  args: string[]
) => Promise<{ stdout: string; stderr: string }>;

export function assertOnMainForRemoteWrite(branch: string): void {
  if (branch !== "main") {
    throw new Error(
      `Publish, Unpublish, and Delete-push are only allowed on main (current branch: ${branch})`
    );
  }
}

export async function getCurrentBranch(run: GitRunner): Promise<string> {
  const { stdout } = await run(["rev-parse", "--abbrev-ref", "HEAD"]);
  return stdout.trim();
}

export async function stagePostPaths(
  run: GitRunner,
  paths: string[]
): Promise<void> {
  if (paths.length === 0) {
    throw new Error("Must stage at least one Post path");
  }
  await run(["add", "--", ...paths]);
}

export async function commitAndPushPostPaths(
  run: GitRunner,
  input: { paths: string[]; message: string }
): Promise<void> {
  const branch = await getCurrentBranch(run);
  assertOnMainForRemoteWrite(branch);
  await stagePostPaths(run, input.paths);
  await run(["commit", "-m", input.message]);
  await run(["push", "origin", "main"]);
}
