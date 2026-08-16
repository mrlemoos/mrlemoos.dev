import {
  buildPostBroadcast,
  createBroadcastDraft,
  postCanonicalUrl,
} from "../broadcast.ts";
import { loadPost } from "./posts.ts";

export type BroadcastConfig = {
  apiKey: string;
  audienceId: string;
  from: string;
  replyTo?: string;
  siteUrl: string;
};

export type BroadcastDeps = {
  fetchImpl?: typeof fetch;
};

export type PostBroadcastDraft = {
  id: string;
  subject: string;
  url: string;
};

/**
 * Local Admin action: turn a live Post into a Resend Broadcast draft.
 *
 * ponytail: draft only, on purpose. This never sends and is never wired into
 * Publish — Publish stays "commit + push the Post", and mailing the audience
 * stays a separate, explicit act the author completes in the Resend dashboard
 * after reading the draft. Tests stub `fetchImpl`, so no test or dev run can
 * touch a real mailbox.
 */
export async function createPostBroadcastDraft(
  repoRoot: string,
  slug: string,
  config: BroadcastConfig,
  { fetchImpl }: BroadcastDeps = {}
): Promise<PostBroadcastDraft> {
  if (!config.apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!config.audienceId) {
    throw new Error("RESEND_AUDIENCE_ID is not configured");
  }

  // Throws on an unsafe Slug before anything else touches the filesystem.
  const post = await loadPost(repoRoot, slug, async () => false);

  if (post.frontmatter.status !== "live") {
    throw new Error(
      "Only live Posts can be broadcast — Publish it first so the link resolves"
    );
  }

  const payload = buildPostBroadcast({
    post: {
      slug: post.slug,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
    siteUrl: config.siteUrl,
    audienceId: config.audienceId,
    from: config.from,
    replyTo: config.replyTo,
  });

  const result = await createBroadcastDraft(payload, {
    apiKey: config.apiKey,
    ...(fetchImpl ? { fetchImpl } : {}),
  });

  if (!result.ok) {
    throw new Error(
      `Resend refused the broadcast (${result.status}): ${result.message}`
    );
  }

  return {
    id: result.id,
    subject: payload.subject,
    url: postCanonicalUrl(config.siteUrl, post.slug),
  };
}
