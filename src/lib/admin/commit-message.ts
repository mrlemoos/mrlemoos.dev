export type BlogCommitAction = "add" | "update" | "remove";

export function buildBlogCommitMessage(input: {
  action: BlogCommitAction;
  title: string;
}): string {
  return `docs(blog): ${input.action} "${input.title}"`;
}
