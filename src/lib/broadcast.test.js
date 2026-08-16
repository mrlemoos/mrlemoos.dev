import { describe, expect, it, vi } from "vitest";
import {
  buildPostBroadcast,
  createBroadcastDraft,
  postCanonicalUrl,
} from "./broadcast.ts";

const post = {
  slug: "hello-world",
  title: "Hello & <World>",
  description: "A short note about nothing much.",
};

describe("postCanonicalUrl", () => {
  it("builds the public Post URL", () => {
    expect(postCanonicalUrl("https://mrlemoos.dev", "hello-world")).toBe(
      "https://mrlemoos.dev/blog/hello-world"
    );
  });

  it("tolerates a trailing slash on the site URL", () => {
    expect(postCanonicalUrl("https://mrlemoos.dev/", "hello-world")).toBe(
      "https://mrlemoos.dev/blog/hello-world"
    );
  });
});

describe("buildPostBroadcast", () => {
  const base = {
    post,
    siteUrl: "https://mrlemoos.dev",
    audienceId: "aud_1",
    from: "Leonardo Lemos <me@mrlemoos.dev>",
  };

  it("targets the audience and sender", () => {
    const payload = buildPostBroadcast(base);

    expect(payload.audience_id).toBe("aud_1");
    expect(payload.from).toBe("Leonardo Lemos <me@mrlemoos.dev>");
  });

  it("uses the Post Title as the subject and broadcast name", () => {
    const payload = buildPostBroadcast(base);

    expect(payload.subject).toContain("Hello & <World>");
    expect(payload.name).toContain("hello-world");
  });

  it("includes the description and canonical link, escaped for HTML", () => {
    const payload = buildPostBroadcast(base);

    expect(payload.html).toContain("https://mrlemoos.dev/blog/hello-world");
    expect(payload.html).toContain("A short note about nothing much.");
    expect(payload.html).toContain("Hello &amp; &lt;World&gt;");
    expect(payload.html).not.toContain("<World>");
  });

  it("includes the Resend unsubscribe token so the broadcast is mailable", () => {
    expect(buildPostBroadcast(base).html).toContain(
      "{{{RESEND_UNSUBSCRIBE_URL}}}"
    );
  });

  it("ships a plain-text alternative with the same link", () => {
    const payload = buildPostBroadcast(base);

    expect(payload.text).toContain("https://mrlemoos.dev/blog/hello-world");
    expect(payload.text).toContain("A short note about nothing much.");
  });

  it("never carries the Post Body — it is a pointer email, not a reprint", () => {
    const payload = buildPostBroadcast({
      ...base,
      post: { ...post, body: "SECRET BODY PARAGRAPH" },
    });

    expect(payload.html).not.toContain("SECRET BODY PARAGRAPH");
    expect(payload.text).not.toContain("SECRET BODY PARAGRAPH");
  });

  it("sets reply_to only when given", () => {
    expect(buildPostBroadcast(base).reply_to).toBeUndefined();
    expect(
      buildPostBroadcast({ ...base, replyTo: "me@mrlemoos.dev" }).reply_to
    ).toBe("me@mrlemoos.dev");
  });
});

const fakeResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
  text: async () => JSON.stringify(body),
});

describe("createBroadcastDraft", () => {
  const payload = buildPostBroadcast({
    post,
    siteUrl: "https://mrlemoos.dev",
    audienceId: "aud_1",
    from: "Leonardo Lemos <me@mrlemoos.dev>",
  });

  it("POSTs the payload to the Resend broadcasts endpoint", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(fakeResponse(201, { id: "bc_1" }));

    const result = await createBroadcastDraft(payload, {
      apiKey: "re_test",
      fetchImpl,
    });

    expect(result).toEqual({ ok: true, id: "bc_1" });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.resend.com/broadcasts");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    expect(JSON.parse(init.body)).toEqual(payload);
  });

  it("creates a draft only — no send and no schedule", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(fakeResponse(201, { id: "bc_1" }));

    await createBroadcastDraft(payload, { apiKey: "re_test", fetchImpl });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).not.toContain("/send");
    expect(JSON.parse(init.body)).not.toHaveProperty("scheduled_at");
  });

  it("reports failures with status and message", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(fakeResponse(422, { message: "audience missing" }));

    const result = await createBroadcastDraft(payload, {
      apiKey: "re_test",
      fetchImpl,
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(422);
    expect(result.message).toContain("audience missing");
  });

  it("fails cleanly when Resend returns a 2xx without an id", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(fakeResponse(200, {}));

    const result = await createBroadcastDraft(payload, {
      apiKey: "re_test",
      fetchImpl,
    });

    expect(result.ok).toBe(false);
  });
});
