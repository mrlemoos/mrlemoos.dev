import type { APIRoute } from "astro";
import { adminApiGuard, errorResponse, getAdminGitRunner, getRepoRoot, jsonResponse } from "@/lib/admin/api";
import { isPathTracked } from "@/lib/admin/git-runner";
import { loadPost } from "@/lib/admin/posts";
import { savePostViaGitContext } from "@/lib/admin/actions";
import { injectTitleAsH1 } from "@/lib/admin/title-body";
import type { PostStatus } from "@/lib/admin/frontmatter";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const blocked = adminApiGuard();
  if (blocked) return blocked;

  const slug = params.slug;
  if (!slug) return errorResponse("Missing Slug", 400);

  try {
    const root = getRepoRoot();
    const run = getAdminGitRunner();
    const post = await loadPost(root, slug, (p) => isPathTracked(run, p));
    return jsonResponse({
      slug: post.slug,
      frontmatter: post.frontmatter,
      body: post.body,
      editorMarkdown: injectTitleAsH1(post.frontmatter.title, post.body),
      tracked: post.tracked,
      everLived: post.everLived,
      relativePath: post.relativePath,
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to load Post",
      404
    );
  }
};

type SaveBody = {
  proposedSlug?: string;
  editorMarkdown: string;
  description: string;
  tags: string[];
  date: string;
  updated?: string;
  status?: PostStatus;
};

export const PUT: APIRoute = async ({ params, request }) => {
  const blocked = adminApiGuard();
  if (blocked) return blocked;

  const slug = params.slug;
  if (!slug) return errorResponse("Missing Slug", 400);

  try {
    const body = (await request.json()) as SaveBody;
    const root = getRepoRoot();
    const run = getAdminGitRunner();
    const existing = await loadPost(root, slug, (p) => isPathTracked(run, p));

    const result = await savePostViaGitContext(root, run, {
      slug,
      proposedSlug: body.proposedSlug,
      editorMarkdown: body.editorMarkdown,
      description: body.description,
      tags: body.tags,
      date: body.date || existing.frontmatter.date,
      updated: body.updated,
      status: body.status ?? existing.frontmatter.status,
    });

    if (!result.ok) {
      return errorResponse(result.error, 422);
    }

    return jsonResponse(result);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to Save Post",
      500
    );
  }
};
