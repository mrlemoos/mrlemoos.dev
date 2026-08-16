import { RESEND_API_BASE, resendHeaders } from "./subscribe.ts";

/**
 * Announcing a Post to the Resend audience.
 *
 * ponytail: this module only ever creates a Resend Broadcast in DRAFT state.
 * There is deliberately no send path and no auto-send-on-Publish hook — the
 * author reviews the draft in the Resend dashboard and presses send there.
 * Sending from code would make an irreversible fan-out one keystroke away from
 * a dev-server accident, so the last step stays human. If a scheduled send is
 * ever wanted, it belongs behind an explicit, separately-guarded action, not
 * folded into this function.
 */

/** Used when `RESEND_FROM_EMAIL` is unset. Must be a Resend-verified sender. */
export const DEFAULT_BROADCAST_FROM =
  "Leonardo Lemos <me@mrlemoos.dev>" as const;

/** Fallback for `import.meta.env.SITE`, which is unset outside an Astro build. */
export const DEFAULT_SITE_URL = "https://mrlemoos.dev" as const;

export type BroadcastPost = {
  slug: string;
  title: string;
  description: string;
};

export type BuildPostBroadcastInput = {
  post: BroadcastPost;
  siteUrl: string;
  audienceId: string;
  from: string;
  replyTo?: string;
};

/** Resend's create-broadcast body. Snake case because the REST API is. */
export type BroadcastPayload = {
  audience_id: string;
  from: string;
  reply_to?: string;
  name: string;
  subject: string;
  html: string;
  text: string;
};

export type CreateBroadcastResult =
  | { ok: true; id: string }
  | { ok: false; status: number; message: string };

export function postCanonicalUrl(siteUrl: string, slug: string): string {
  return `${siteUrl.replace(/\/+$/, "")}/blog/${slug}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * A short "new Post is up" email built from frontmatter alone — Title,
 * Description and a link to the canonical URL. The Body never travels with it:
 * the email is a pointer to the site, not a reprint of the Post.
 */
export function buildPostBroadcast({
  post,
  siteUrl,
  audienceId,
  from,
  replyTo,
}: BuildPostBroadcastInput): BroadcastPayload {
  const url = postCanonicalUrl(siteUrl, post.slug);
  const title = post.title.trim();
  const description = post.description.trim();

  const html = [
    `<div style="font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.6;color:#171717;max-width:34rem;margin:0 auto;padding:24px">`,
    `<p style="margin:0 0 24px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#737373">New post</p>`,
    `<h1 style="margin:0 0 12px;font-size:28px;font-weight:400;line-height:1.25">${escapeHtml(title)}</h1>`,
    `<p style="margin:0 0 24px;color:#525252">${escapeHtml(description)}</p>`,
    `<p style="margin:0 0 32px"><a href="${escapeHtml(url)}" style="color:#171717">Read it on mrlemoos.dev &rarr;</a></p>`,
    `<hr style="border:0;border-top:1px solid #e5e5e5;margin:0 0 16px" />`,
    `<p style="margin:0;font-size:12px;color:#a3a3a3">You're getting this because you subscribed at mrlemoos.dev. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#a3a3a3">Unsubscribe</a>.</p>`,
    `</div>`,
  ].join("");

  const text = [
    "New post",
    "",
    title,
    "",
    description,
    "",
    `Read it: ${url}`,
    "",
    "Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}",
    "",
  ].join("\n");

  const payload: BroadcastPayload = {
    audience_id: audienceId,
    from,
    name: `blog/${post.slug}`,
    subject: title,
    html,
    text,
  };

  if (replyTo) {
    payload.reply_to = replyTo;
  }

  return payload;
}

async function readErrorMessage(response: {
  json: () => Promise<unknown>;
  text: () => Promise<string>;
}): Promise<string> {
  try {
    const body = (await response.json()) as { message?: unknown } | null;
    if (body && typeof body.message === "string") {
      return body.message.slice(0, 500);
    }
    return JSON.stringify(body).slice(0, 500);
  } catch {
    try {
      return (await response.text()).slice(0, 500);
    } catch {
      return "Resend returned an unreadable error";
    }
  }
}

/**
 * Creates the broadcast in Resend. Resend creates broadcasts as drafts; this
 * function never calls `/broadcasts/{id}/send` and never sets `scheduled_at`.
 */
export async function createBroadcastDraft(
  payload: BroadcastPayload,
  { apiKey, fetchImpl = fetch }: { apiKey: string; fetchImpl?: typeof fetch }
): Promise<CreateBroadcastResult> {
  const response = await fetchImpl(`${RESEND_API_BASE}/broadcasts`, {
    method: "POST",
    headers: resendHeaders(apiKey),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: await readErrorMessage(response),
    };
  }

  const body = (await response.json()) as { id?: unknown } | null;
  if (!body || typeof body.id !== "string") {
    return {
      ok: false,
      status: response.status,
      message: "Resend accepted the broadcast but returned no id",
    };
  }

  return { ok: true, id: body.id };
}
