import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { remarkMathOptions } from "./mdx-remark-math-options.ts";

const require = createRequire(import.meta.url);
const { fromMarkdown } = require("mdast-util-from-markdown");
const { mathFromMarkdown } = require("mdast-util-math");
const { math } = require("micromark-extension-math");

function parseParagraph(markdown) {
  return fromMarkdown(markdown, {
    extensions: [math(remarkMathOptions)],
    mdastExtensions: [mathFromMarkdown()],
  });
}

function inlineMathNodes(tree) {
  const nodes = [];
  const visit = (node) => {
    if (node.type === "inlineMath") nodes.push(node);
    if (node.children) node.children.forEach(visit);
  };
  visit(tree);
  return nodes;
}

describe("remark math options", () => {
  it("does not treat currency dollars as inline math", () => {
    const tree = parseParagraph(
      "Of the total, $1,063.51 came out of the plan. The other $463.01 was on-demand."
    );
    expect(inlineMathNodes(tree)).toHaveLength(0);
  });

  it("still allows explicit double-dollar inline math", () => {
    const tree = parseParagraph("Lift coefficient $$C_L$$ here.");
    expect(inlineMathNodes(tree)).toHaveLength(1);
    expect(inlineMathNodes(tree)[0].value).toBe("C_L");
  });
});
