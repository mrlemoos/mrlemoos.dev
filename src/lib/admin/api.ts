import path from "node:path";
import { fileURLToPath } from "node:url";
import { requireAdminDev } from "./dev-gate.ts";
import { createGitRunner } from "./git-runner.ts";

export function getRepoRoot(): string {
  // src/lib/admin -> repo root
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
}

export function adminApiGuard(): Response | null {
  return requireAdminDev(import.meta.env.DEV);
}

export function getAdminGitRunner() {
  return createGitRunner(getRepoRoot());
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status);
}
