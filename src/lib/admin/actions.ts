import { unlink, writeFile } from "node:fs/promises";
import { buildBlogCommitMessage } from "./commit-message.ts";
import { commitAndPushPostPaths, type GitRunner } from "./git.ts";
import { isPathTracked } from "./git-runner.ts";
import {
  loadPost,
  savePost,
  type SavePostInput,
  todayDateString,
} from "./posts.ts";
import { serialisePostFile } from "./frontmatter.ts";

async function trackedChecker(run: GitRunner) {
  return (relativePath: string) => isPathTracked(run, relativePath);
}

export async function publishPost(
  repoRoot: string,
  run: GitRunner,
  slug: string
): Promise<{ relativePath: string; message: string }> {
  const isTracked = await trackedChecker(run);
  const post = await loadPost(repoRoot, slug, isTracked);
  const wasEverLive = post.everLived;
  const action = wasEverLive ? "update" : "add";

  post.frontmatter.status = "live";
  if (wasEverLive) {
    post.frontmatter.updated = todayDateString();
  }

  const contents = serialisePostFile({
    frontmatter: post.frontmatter,
    body: post.body,
  });
  await writeFile(post.absolutePath, contents, "utf8");

  const message = buildBlogCommitMessage({
    action,
    title: post.frontmatter.title,
  });

  await commitAndPushPostPaths(run, {
    paths: [post.relativePath],
    message,
  });

  return { relativePath: post.relativePath, message };
}

export async function unpublishPost(
  repoRoot: string,
  run: GitRunner,
  slug: string
): Promise<{ relativePath: string; message: string }> {
  const isTracked = await trackedChecker(run);
  const post = await loadPost(repoRoot, slug, isTracked);

  if (post.frontmatter.status !== "live") {
    throw new Error("Only live Posts can be Unpublished");
  }

  post.frontmatter.status = "draft";
  const contents = serialisePostFile({
    frontmatter: post.frontmatter,
    body: post.body,
  });
  await writeFile(post.absolutePath, contents, "utf8");

  const message = buildBlogCommitMessage({
    action: "update",
    title: post.frontmatter.title,
  });

  await commitAndPushPostPaths(run, {
    paths: [post.relativePath],
    message,
  });

  return { relativePath: post.relativePath, message };
}

export async function deletePostWithGit(
  repoRoot: string,
  run: GitRunner,
  slug: string
): Promise<{ message: string | null; pushed: boolean }> {
  const isTracked = await trackedChecker(run);
  const post = await loadPost(repoRoot, slug, isTracked);

  if (post.frontmatter.status !== "draft") {
    throw new Error("Only Draft Posts can be deleted from Local Admin");
  }

  await unlink(post.absolutePath);

  if (!post.tracked) {
    return { message: null, pushed: false };
  }

  const message = buildBlogCommitMessage({
    action: "remove",
    title: post.frontmatter.title,
  });

  await commitAndPushPostPaths(run, {
    paths: [post.relativePath],
    message,
  });

  return { message, pushed: true };
}

export async function savePostViaGitContext(
  repoRoot: string,
  run: GitRunner,
  input: SavePostInput
) {
  const isTracked = await trackedChecker(run);
  return savePost(repoRoot, input, isTracked);
}
