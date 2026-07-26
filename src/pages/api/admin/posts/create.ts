import type { APIRoute } from "astro";
import { adminApiGuard, errorResponse, getAdminGitRunner, getRepoRoot, jsonResponse } from "@/lib/admin/api";
import { savePostViaGitContext } from "@/lib/admin/actions";
import { deriveSlugFromTitle } from "@/lib/admin/slug";
import { todayDateString } from "@/lib/admin/posts";
import { extractTitleFromEditorMarkdown } from "@/lib/admin/title-body";

export const prerender = false;

type CreateBody = {
  editorMarkdown: string;
  description: string;
  tags: string[];
  date?: string;
  proposedSlug?: string;
};

export const POST: APIRoute = async ({ request }) => {
  const blocked = adminApiGuard();
  if (blocked) return blocked;

  try {
    const body = (await request.json()) as CreateBody;
    const { title } = extractTitleFromEditorMarkdown(body.editorMarkdown);
    const slug =
      body.proposedSlug?.trim() ||
      deriveSlugFromTitle(title) ||
      `draft-${Date.now()}`;

    const root = getRepoRoot();
    const run = getAdminGitRunner();
    const result = await savePostViaGitContext(root, run, {
      slug,
      proposedSlug: slug,
      editorMarkdown: body.editorMarkdown,
      description: body.description ?? "",
      tags: body.tags ?? [],
      date: body.date ?? todayDateString(),
      status: "draft",
      create: true,
    });

    if (!result.ok) {
      return errorResponse(result.error, 422);
    }

    return jsonResponse(result, 201);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to create Post",
      500
    );
  }
};
