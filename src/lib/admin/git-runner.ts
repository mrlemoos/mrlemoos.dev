import { spawn } from "node:child_process";
import type { GitRunner } from "./git.ts";

export function createGitRunner(cwd: string): GitRunner {
  return (args) =>
    new Promise((resolve, reject) => {
      const child = spawn("git", args, {
        cwd,
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
      });
      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
          return;
        }
        reject(
          new Error(
            `git ${args.join(" ")} failed (exit ${code ?? "?"}): ${stderr || stdout}`
          )
        );
      });
    });
}

export async function isPathTracked(
  run: GitRunner,
  relativePath: string
): Promise<boolean> {
  try {
    await run(["ls-files", "--error-unmatch", "--", relativePath]);
    return true;
  } catch {
    return false;
  }
}
