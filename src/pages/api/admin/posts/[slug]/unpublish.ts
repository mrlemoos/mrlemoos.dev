import type { APIRoute } from "astro";
import { adminApiGuard, errorResponse, getAdminGitRunner, getRepoRoot, jsonResponse } from "@/lib/admin/api";
import { unpublishPost } from "@/lib/admin/actions";

export const prerender = false;

export const POST: APIRoute = async ({ params }) => {
  const blocked = adminApiGuard();
  if (blocked) return blocked;

  const slug = params.slug;
  if (!slug) return errorResponse("Missing Slug", 400);

  try {
    const result = await unpublishPost(getRepoRoot(), getAdminGitRunner(), slug);
    return jsonResponse(result);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to Unpublish",
      500
    );
  }
};
