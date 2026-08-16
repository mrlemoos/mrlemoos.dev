import type { APIRoute } from "astro";
import { adminApiGuard, errorResponse, getRepoRoot, jsonResponse } from "@/lib/admin/api";
import { createPostBroadcastDraft } from "@/lib/admin/broadcast";
import { DEFAULT_BROADCAST_FROM, DEFAULT_SITE_URL } from "@/lib/broadcast";

export const prerender = false;

/**
 * ponytail: DEV-only, draft-only. `adminApiGuard()` 404s this route outside
 * development exactly like the other Local Admin routes, so it is never
 * reachable by an anonymous request in production. Even in DEV it only creates
 * a Resend Broadcast draft — the author reviews and sends it from the Resend
 * dashboard. There is no send endpoint here on purpose.
 */
export const POST: APIRoute = async ({ params }) => {
  const blocked = adminApiGuard();
  if (blocked) return blocked;

  const slug = params.slug;
  if (!slug) return errorResponse("Missing Slug", 400);

  try {
    const result = await createPostBroadcastDraft(getRepoRoot(), slug, {
      apiKey: import.meta.env.RESEND_API_KEY ?? "",
      audienceId: import.meta.env.RESEND_AUDIENCE_ID ?? "",
      from: import.meta.env.RESEND_FROM_EMAIL || DEFAULT_BROADCAST_FROM,
      replyTo: import.meta.env.RESEND_REPLY_TO || undefined,
      siteUrl: import.meta.env.SITE || DEFAULT_SITE_URL,
    });

    return jsonResponse(result);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to create broadcast draft",
      500
    );
  }
};
