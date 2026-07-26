import type { PostStatus } from "./frontmatter.ts";

type StatusBearing = {
  status?: PostStatus | string | null;
};

export function isLivePost(data: StatusBearing): boolean {
  if (data.status === undefined || data.status === null) {
    return true;
  }
  return data.status === "live";
}

export function filterLivePosts<T extends { data: StatusBearing }>(
  posts: T[]
): T[] {
  return posts.filter((post) => isLivePost(post.data));
}
