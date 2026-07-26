import type { APIRoute } from "astro";
import { adminApiGuard, errorResponse, getAdminGitRunner, jsonResponse } from "@/lib/admin/api";
import { getCurrentBranch } from "@/lib/admin/git";

export const prerender = false;

export const GET: APIRoute = async () => {
  const blocked = adminApiGuard();
  if (blocked) return blocked;

  try {
    const branch = await getCurrentBranch(getAdminGitRunner());
    return jsonResponse({ branch, onMain: branch === "main" });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to read git status",
      500
    );
  }
};
