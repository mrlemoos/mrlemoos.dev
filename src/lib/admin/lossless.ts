import { MarkdownManager } from "@tiptap/markdown";
import type { JSONContent } from "@tiptap/core";
import { bodyDialectExtensions } from "./extensions.ts";

function createMarkdownManager(): MarkdownManager {
  return new MarkdownManager({
    markedOptions: { gfm: true },
    extensions: bodyDialectExtensions(),
  });
}

let manager: MarkdownManager | undefined;

function getManager(): MarkdownManager {
  if (!manager) {
    manager = createMarkdownManager();
  }
  return manager;
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function containsHtmlEscapeMangle(original: string, roundTripped: string): boolean {
  if (original.includes("<") && roundTripped.includes("&lt;")) {
    return true;
  }
  if (original.includes(">") && roundTripped.includes("&gt;")) {
    return true;
  }
  return false;
}

export function roundTripBody(body: string): string {
  const mgr = getManager();
  const json = mgr.parse(body) as JSONContent;
  return mgr.serialize(json);
}

export function isBodyLossless(body: string): boolean {
  const mgr = getManager();
  const originalJson = mgr.parse(body) as JSONContent;
  const serialised = mgr.serialize(originalJson);
  const roundTripJson = mgr.parse(serialised) as JSONContent;

  if (!deepEqual(originalJson, roundTripJson)) {
    return false;
  }

  if (containsHtmlEscapeMangle(body, serialised)) {
    return false;
  }

  return true;
}
