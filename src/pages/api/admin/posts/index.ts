import type { APIRoute } from "astro";
import { adminApiGuard, errorResponse, getAdminGitRunner, getRepoRoot, jsonResponse } from "@/lib/admin/api";
import { isPathTracked } from "@/lib/admin/git-runner";
import { listPosts } from "@/lib/admin/posts";

export const prerender = false;

export const GET: APIRoute = async () => {
  const blocked = adminApiGuard();
  if (blocked) return blocked;

  try {
    const root = getRepoRoot();
    const run = getAdminGitRunner();
    const posts = await listPosts(root, (p) => isPathTracked(run, p));
    return jsonResponse({ posts });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to list Posts",
      500
    );
  }
};
