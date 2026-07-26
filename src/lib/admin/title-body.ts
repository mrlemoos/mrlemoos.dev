const LEADING_H1_RE = /^#\s+(.+?)\s*\n(?:\n)?/;

export function injectTitleAsH1(title: string, body: string): string {
  const withoutLeading = stripLeadingH1FromBody(body);
  return `# ${title}\n\n${withoutLeading}`;
}

export function extractTitleFromEditorMarkdown(markdown: string): {
  title: string;
  body: string;
} {
  const match = LEADING_H1_RE.exec(markdown);
  if (!match) {
    return { title: "", body: markdown };
  }

  return {
    title: match[1]!.trim(),
    body: markdown.slice(match[0].length),
  };
}

export function stripLeadingH1FromBody(markdown: string): string {
  return markdown.replace(LEADING_H1_RE, "");
}
