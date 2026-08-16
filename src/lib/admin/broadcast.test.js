import { describe, expect, it, vi } from "vitest";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createPostBroadcastDraft } from "./broadcast.ts";

async function makeRepoWithPost({ status = "live", slug = "hello-world" } = {}) {
  const root = await mkdtemp(path.join(tmpdir(), "admin-broadcast-"));
  await mkdir(path.join(root, "src/content/blog"), { recursive: true });
  await writeFile(
    path.join(root, `src/content/blog/${slug}.mdx`),
    [
      "---",
      'title: "Hello World"',
      'date: "2026-08-01"',
      'description: "A short note."',
      "tags:",
      "  - blog",
      `status: "${status}"`,
      "---",
      "",
      "Body paragraph that must never reach the email.",
      "",
    ].join("\n"),
    "utf8"
  );
  return root;
}

const config = {
  apiKey: "re_test",
  audienceId: "aud_1",
  from: "Leonardo Lemos <me@mrlemoos.dev>",
  siteUrl: "https://mrlemoos.dev",
};

const okFetch = () =>
  vi.fn().mockResolvedValue({
    ok: true,
    status: 201,
    json: async () => ({ id: "bc_1" }),
    text: async () => '{"id":"bc_1"}',
  });

describe("createPostBroadcastDraft", () => {
  it("creates a Resend draft for a live Post", async () => {
    const root = await makeRepoWithPost();
    const fetchImpl = okFetch();

    const result = await createPostBroadcastDraft(root, "hello-world", config, {
      fetchImpl,
    });

    expect(result).toEqual({
      id: "bc_1",
      subject: expect.stringContaining("Hello World"),
      url: "https://mrlemoos.dev/blog/hello-world",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("never posts the Post Body into the broadcast", async () => {
    const root = await makeRepoWithPost();
    const fetchImpl = okFetch();

    await createPostBroadcastDraft(root, "hello-world", config, { fetchImpl });

    const [, init] = fetchImpl.mock.calls[0];
    expect(init.body).not.toContain("Body paragraph");
  });

  it("refuses a Draft Post — the canonical URL is not public yet", async () => {
    const root = await makeRepoWithPost({ status: "draft" });
    const fetchImpl = okFetch();

    await expect(
      createPostBroadcastDraft(root, "hello-world", config, { fetchImpl })
    ).rejects.toThrow(/live/i);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("refuses an unsafe Slug", async () => {
    const root = await makeRepoWithPost();
    const fetchImpl = okFetch();

    await expect(
      createPostBroadcastDraft(root, "../../etc/passwd", config, { fetchImpl })
    ).rejects.toThrow();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("surfaces Resend errors as thrown Errors", async () => {
    const root = await makeRepoWithPost();
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ message: "audience missing" }),
      text: async () => '{"message":"audience missing"}',
    });

    await expect(
      createPostBroadcastDraft(root, "hello-world", config, { fetchImpl })
    ).rejects.toThrow(/audience missing/);
  });

  it("requires an API key and an audience", async () => {
    const root = await makeRepoWithPost();
    const fetchImpl = okFetch();

    await expect(
      createPostBroadcastDraft(
        root,
        "hello-world",
        { ...config, apiKey: "" },
        { fetchImpl }
      )
    ).rejects.toThrow(/RESEND_API_KEY/);

    await expect(
      createPostBroadcastDraft(
        root,
        "hello-world",
        { ...config, audienceId: "" },
        { fetchImpl }
      )
    ).rejects.toThrow(/RESEND_AUDIENCE_ID/);

    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
