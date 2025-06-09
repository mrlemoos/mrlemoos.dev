import { Highlight, type HighlightProps, themes } from "prism-react-renderer";
import type { JSX } from "react";

import { cn } from "@/lib/css";

interface CodeBlockProps
  extends Partial<Omit<HighlightProps, "children" | "code">> {
  /**
   * The code to be displayed.
   */
  children: string;
  /**
   * The class name of the code block.
   * This is appended to the `pre` element's class name, wrapping the entire code block.
   */
  className?: string;
}

/**
 * A code block component that displays code with syntax highlighting.
 *
 * @example
 * <CodeBlock>
 *   {`
 *   const a = 1;
 *   const b = 2;
 *   `}
 * </CodeBlock>
 */
export function CodeBlock({
  children,
  className,
  theme = themes.vsDark,
  language = className ? className.replace(/language-/, "") : "",
  prism,
}: CodeBlockProps): JSX.Element {
  return (
    <Highlight
      theme={theme}
      code={children.trim()}
      language={language}
      prism={prism}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            "font-code p-4 rounded-md mb-3 overflow-x-auto",
            className
          )}
          style={style}
        >
          {tokens.map((line, i) => (
            <div
              key={`${line
                .map((token) => token.types.join("+"))
                .join(" ")}${i}`}
              {...getLineProps({ line })}
            >
              {line.map((token, j) => (
                <span
                  key={`${token.types.join("+")}${token.content}${j}`}
                  {...getTokenProps({ token })}
                />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
