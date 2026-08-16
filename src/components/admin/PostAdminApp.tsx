import { useCallback, useEffect, useMemo, useState } from "react";
import { PostEditor } from "./PostEditor";
import { deriveSlugFromTitle } from "@/lib/admin/slug";

type PostPayload = {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    updated?: string;
    description: string;
    tags: string[];
    status: "draft" | "live";
  };
  editorMarkdown: string;
  tracked: boolean;
  everLived: boolean;
};

type GitStatus = {
  branch: string;
  onMain: boolean;
};

type Mode = "edit" | "create";

type Props = {
  mode: Mode;
  initialSlug?: string;
};

async function readJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(
      typeof data === "object" && data && "error" in data && data.error
        ? data.error
        : `Request failed (${res.status})`
    );
  }
  return data;
}

export function PostAdminApp({ mode, initialSlug }: Props) {
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [git, setGit] = useState<GitStatus | null>(null);

  const [slug, setSlug] = useState(initialSlug ?? "");
  const [proposedSlug, setProposedSlug] = useState(initialSlug ?? "");
  const [editorMarkdown, setEditorMarkdown] = useState("# Untitled\n\n");
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("blog");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [updated, setUpdated] = useState("");
  const [status, setStatus] = useState<"draft" | "live">("draft");
  const [everLived, setEverLived] = useState(false);

  const slugFrozen = everLived;

  const tags = useMemo(
    () =>
      tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [tagsText]
  );

  const markDirty = useCallback(() => {
    setDirty(true);
    setMessage(null);
  }, []);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    void (async () => {
      try {
        const gitRes = await fetch("/api/admin/git-status");
        setGit(await readJson<GitStatus>(gitRes));
      } catch {
        setGit(null);
      }
    })();
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !initialSlug) return;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/posts/${initialSlug}`);
        const post = await readJson<PostPayload>(res);
        setSlug(post.slug);
        setProposedSlug(post.slug);
        setEditorMarkdown(post.editorMarkdown);
        setDescription(post.frontmatter.description);
        setTagsText(post.frontmatter.tags.join(", "));
        setDate(post.frontmatter.date);
        setUpdated(post.frontmatter.updated ?? "");
        setStatus(post.frontmatter.status);
        setEverLived(post.everLived);
        setDirty(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load Post");
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, initialSlug]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/posts/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            editorMarkdown,
            description,
            tags,
            date,
            proposedSlug,
          }),
        });
        const result = await readJson<{ slug: string }>(res);
        setDirty(false);
        setMessage(`Saved Draft “${result.slug}”`);
        window.location.href = `/admin/posts/${result.slug}`;
        return;
      }

      const res = await fetch(`/api/admin/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposedSlug: slugFrozen ? slug : proposedSlug,
          editorMarkdown,
          description,
          tags,
          date,
          updated: updated || undefined,
          status,
        }),
      });
      const result = await readJson<{ slug: string }>(res);
      setDirty(false);
      setMessage("Saved");
      if (result.slug !== slug) {
        window.location.href = `/admin/posts/${result.slug}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [
    mode,
    editorMarkdown,
    description,
    tags,
    date,
    proposedSlug,
    slug,
    slugFrozen,
    updated,
    status,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [save]);

  const runAction = useCallback(
    async (action: "publish" | "unpublish" | "delete") => {
      if (action === "delete") {
        const ok = window.confirm(
          "Delete this Draft? This cannot be undone from Local Admin."
        );
        if (!ok) return;
      }

      setSaving(true);
      setError(null);
      setMessage(null);
      try {
        if (dirty) {
          throw new Error("Save before Publish, Unpublish, or Delete");
        }

        if (action === "delete") {
          const res = await fetch(`/api/admin/posts/${slug}/delete`, {
            method: "DELETE",
          });
          await readJson(res);
          window.location.href = "/admin";
          return;
        }

        const res = await fetch(`/api/admin/posts/${slug}/${action}`, {
          method: "POST",
        });
        const result = await readJson<{ message: string }>(res);
        setMessage(
          action === "publish"
            ? `Published — ${result.message}`
            : `Unpublished — ${result.message}`
        );

        const reload = await fetch(`/api/admin/posts/${slug}`);
        const post = await readJson<PostPayload>(reload);
        setStatus(post.frontmatter.status);
        setUpdated(post.frontmatter.updated ?? "");
        setEverLived(post.everLived);
        setEditorMarkdown(post.editorMarkdown);
        setDirty(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Action failed");
      } finally {
        setSaving(false);
      }
    },
    [dirty, slug]
  );

  // ponytail: creates a DRAFT broadcast in Resend and stops there. Nothing is
  // mailed from Local Admin — the author reviews the draft in the Resend
  // dashboard and sends it from there. Deliberately not chained onto Publish.
  const createBroadcast = useCallback(async () => {
    const ok = window.confirm(
      "Create a draft broadcast in Resend for this Post? Nothing is sent — you review and send it from the Resend dashboard."
    );
    if (!ok) return;

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      if (dirty) {
        throw new Error("Save before creating a broadcast draft");
      }

      const res = await fetch(`/api/admin/posts/${slug}/broadcast`, {
        method: "POST",
      });
      const result = await readJson<{ id: string; subject: string }>(res);
      setMessage(
        `Broadcast draft created (${result.id}) — “${result.subject}”. Review and send it in the Resend dashboard; nothing has been mailed.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create broadcast draft"
      );
    } finally {
      setSaving(false);
    }
  }, [dirty, slug]);

  if (loading) {
    return <p className="text-muted-foreground">Loading Post…</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <a href="/admin" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            ← Posts
          </a>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {status}
            {dirty ? " · unsaved" : ""}
          </span>
          {git && (
            <span className="font-mono text-xs text-muted-foreground">
              branch {git.branch}
              {git.onMain ? "" : " (remote writes blocked)"}
            </span>
          )}
        </div>

        <PostEditor
          initialMarkdown={editorMarkdown}
          onChange={(md) => {
            setEditorMarkdown(md);
            markDirty();
          }}
          onTitleChange={(title) => {
            if (mode === "create" && !slugFrozen) {
              setProposedSlug(deriveSlugFromTitle(title));
            }
          }}
        />
      </div>

      <aside className="space-y-4 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <h2 className="font-heading text-2xl text-foreground">Post details</h2>

        <p className="text-sm text-muted-foreground">
          Status{" "}
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-foreground">
            {status}
          </span>
        </p>

        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Slug</span>
          <input
            className="w-full rounded-sm border border-border bg-background px-3 py-2 font-mono text-sm disabled:opacity-60"
            value={proposedSlug}
            disabled={slugFrozen}
            onChange={(e) => {
              setProposedSlug(e.target.value);
              markDirty();
            }}
          />
          {slugFrozen && (
            <span className="block text-xs text-muted-foreground">
              Frozen after first Publish
            </span>
          )}
        </label>

        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Description</span>
          <textarea
            className="min-h-24 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              markDirty();
            }}
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Tags (comma-separated)</span>
          <input
            className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
            value={tagsText}
            onChange={(e) => {
              setTagsText(e.target.value);
              markDirty();
            }}
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Date</span>
          <input
            type="date"
            className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              markDirty();
            }}
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Updated</span>
          <input
            type="date"
            className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm disabled:opacity-60"
            value={updated}
            disabled={status !== "live"}
            onChange={(e) => {
              setUpdated(e.target.value);
              markDirty();
            }}
          />
          <span className="block text-xs text-muted-foreground">
            {status === "live"
              ? "Stamped on re-Publish; manual override allowed while live"
              : "Unused while Draft — stamped on re-Publish"}
          </span>
        </label>

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-sm bg-foreground px-3 py-2 text-sm text-background disabled:opacity-50"
          >
            {saving ? "Working…" : "Save"}
          </button>

          {mode === "edit" && status === "draft" && (
            <button
              type="button"
              disabled={saving || !!git && !git.onMain}
              onClick={() => void runAction("publish")}
              className="rounded-sm border border-border px-3 py-2 text-sm disabled:opacity-50"
            >
              Publish
            </button>
          )}

          {mode === "edit" && status === "live" && (
            <>
              <button
                type="button"
                disabled={saving || !!git && !git.onMain}
                onClick={() => void runAction("publish")}
                className="rounded-sm border border-border px-3 py-2 text-sm disabled:opacity-50"
              >
                Publish update
              </button>
              <button
                type="button"
                disabled={saving || !!git && !git.onMain}
                onClick={() => void runAction("unpublish")}
                className="rounded-sm border border-border px-3 py-2 text-sm disabled:opacity-50"
              >
                Unpublish
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void createBroadcast()}
                className="rounded-sm border border-border px-3 py-2 text-sm disabled:opacity-50"
              >
                Create broadcast draft
              </button>
              <p className="text-xs text-muted-foreground">
                Builds a Resend draft from Title, Description and the Post link.
                Nothing is sent — review and send it from the Resend dashboard.
              </p>
            </>
          )}

          {mode === "edit" && status === "draft" && (
            <button
              type="button"
              disabled={saving}
              onClick={() => void runAction("delete")}
              className="rounded-sm border border-red-300 px-3 py-2 text-sm text-red-700 disabled:opacity-50 dark:border-red-900 dark:text-red-300"
            >
              Delete Draft
            </button>
          )}
        </div>

        {message && (
          <p className="text-sm text-muted-foreground" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">
            {error}
          </p>
        )}
      </aside>
    </div>
  );
}
